const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  // Create token
  sendTokenResponse(user, 201, res);
});

// @desc        Login User
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Invalid Credentials', 401));

  const isMatch = await user.matchPassword(password);

  if (!isMatch) return next(new ErrorResponse('Invalid Credentials', 401));

  // Create token
  sendTokenResponse(user, 200, res);
});

// @desc        Get Logged In User Via Token
// @route       POST /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

// GET TOKEN FROM MODEL, CREATE COOKIE, AND SEND RESPONSE
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    status: 'success',
    token,
  });
};
