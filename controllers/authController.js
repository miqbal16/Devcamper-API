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
  const token = user.getSignedJwtToken();

  res.status(200).json({
    status: 'success',
    token,
  });
});

// @desc        Register User
// @route       POST /api/v1/auth/register
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
  const token = user.getSignedJwtToken();

  res.status(200).json({
    status: 'success',
    token,
  });
});
