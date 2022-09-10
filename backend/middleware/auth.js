const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Check if user is logged in
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Login to access this resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // as long as the user is logged in, we can access the user data in the req.user
    req.user = await User.findById(decoded.id);

    next();
});

// Check if user is admin
exports.authorizedRoles = (...roles) => {

    return (req, res, next) => {
        // we can access the user data in the req.user as we did in the isAuthenticatedUser middleware which runs first
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not authorized to access this resource`, 403));
        }
        next();
    }
}
