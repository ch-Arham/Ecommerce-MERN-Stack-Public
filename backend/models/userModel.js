const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // encrypt password before saving to database
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Required"],
        minlength: [2, "Name Must Be At Least 2 Characters"],
        maxlength: [50, "Name Must Be At Most 50 Characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: true,
        validate: [validator.isEmail, "Email Is Invalid"],
    },
    password: {
        type: String,
        required: [true, "Password Is Required"],
        minlength: [8, "Password Must Be At Least 8 Characters"],
        maxlength: [50, "Password Must Be At Most 50 Characters"],
        select: false, // this will not be returned when querying the user
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre('save', async function (next) {

    // if user is new or password is modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // password is not modified so we can skip this and not encrypt it again
    next(); // call next middleware which is either create or update user
})


// Generating JWT Token for authentication and returning it
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// Compare password to hashed password in database
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Generating Reset Password Token
userSchema.methods.getResetPasswordToken = function () {

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);