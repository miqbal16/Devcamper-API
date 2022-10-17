const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  try {
    // Verifiction token
    const decode = jwt.verify(token, process.env.JWT_SECRET); // { id: xxxx, iat: yyyy, exp: yyyy }

    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access to route', 401));
  }
});

// GRENT ACCESS TO SPECIFIC ROLES

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
