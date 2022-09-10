const catchAsyncErrors = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");
const cloudinary = require('cloudinary');

/*
Controller 01: Register A New User           /api/v1/users/new          (POST)
Controller 02: Login A User                  /api/v1/users/login        (POST)
Controller 03: Logout A User                 /api/v1/users/logout       (GET)
Controller 04: Forgot password               /api/v1//password/forgot   (POST)
Controller 05: Reset password                /api/v1/password/reset     (POST)
Controller 06: Get User Detail               /api/v1/me                 (GET)
Controller 07: Update User Password          /api/v1/password/update    (PUT)
Controller 08: Update User Profile           /api/v1/me/update          (PUT)
Controller 09: Get All Users (Admin)         /api/v1/admin/users        (GET)
Controller 10: Get Single User (Admin)       /api/v1/admin/user/:id     (GET)
Controller 11: Update User Role (Admin)      /api/v1/admin/user/:id     (PUT) 
Controller 12: Delete User (Admin)           /api/v1/admin/user/:id     (DELETE)
*/


// Controller 1: Register a new user /api/v1/users/new -- POST
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars', // The name of the folder in cloudinary
        width: 150,
        crop: "scale"
    });
    
    const { name, email, password } = req.body;

    // check if user already exists ------ This error is handled 

    // create user
    const user = await User.create({ name, email, password,
        avatar: { // temp for now
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        } 
    });

    sendToken(user, 200, res, 'User registered successfully');
});


// Controller 2: Login a user /api/v1/users/login -- POST
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if user has provided email and password
    if(!email || !password){
        return next(new ErrorHandler(`Enter Your Credentials`, 400));
    }

    // check if user exists and password is correct
    let user = await User.findOne({ email }).select('+password');
    if(!user){
        return next(new ErrorHandler(`Invalid Credentials: Login With Correct Credentials`, 401));
    }

    // check if password is correct
    const comparePassword = await user.comparePassword(password);
    if(!comparePassword){
        return next(new ErrorHandler(`Invalid Credentials: Login With Correct Credentials`, 401));
    }

    sendToken(user, 201, res, "User logged in successfully");

});


// Controller 3: Logout a user /api/v1/users/logout -- GET
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
});


// Controller 4: Forgot Password /api/v1//password/forgot -- POST
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler(`User does not exist with email: ${email}`, 404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    // Save the token to user's resetPasswordToken 2:58
    await user.save({ validateBeforeSave: false });

    // Create a reset URL
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
   

    const message = `Your Password Reset Token Is:\n\n${resetPasswordUrl} \n\nIf You Have Not Requested This Email Then Ignore This Message.`;

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email successfully sent to: ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message,500));
    }

});


// Controller 5: Reset Password /api/v1/password/reset -- POST
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash 
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler(`Reset Password Token Is Invalid or Has Been Expired`, 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(`Passwords do not match`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res, 'Password reset successfully');
});


/* Following are the user profile management controllers */


// Controller 6: Get user Detail /api/v1/me -- GET -- user is logged in (own details)
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user })
});


// Controller 7: Update User Password /api/v1/password/update -- PUT -- user is logged in
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    
    const comparePassword = await user.comparePassword(req.body.oldPassword);

    if(!comparePassword){
        return next(new ErrorHandler(`Old Password Is Incorrect`, 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler(`Passwords do not match`, 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res, 'Password updated successfully');

});


// Controller 8: Update User Profile /api/v1/me/update -- PUT -- user is logged in
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email, // || req.user.email removed
    }

    if (req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars', // The name of the folder in cloudinary
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.url
        }
    } 

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true, user });
});


// Controller 9: Get All Users (Admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({ success: true, users });
});


// Controller 10: Get A Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
      

    res.status(200).json({ success: true, user });
});


// Controller 11: Update User Role (Admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true });
});


// Controller 12: Delete User (Admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
});