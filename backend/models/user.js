//Schema
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { timeStamp } = require("console");

//create scheme

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name!"],
        maxlength: [20, "Cannot Exceed 20 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Enter a Valid Email!"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password!"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please Confirm Your Password!"],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Password Are Not Same!"
        }
    },

    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Enter Valid Phone Number!"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        public_id: String,
        url: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
    { timestamps: true }
);

// hash password
//pre("save") => runs before data is saved
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

//pass compare at login time

userSchema.methods.correctPassword = async function (
    candidatePassword, userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
//checks whether the user's ass was changes after getting jwt token
//if yes, the Old token is invalid and user must log in again
userSchema.methods.changedPasswordAfter = function (JWTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        )
        return JWTimestamp < changedTimestamp
    }
    return false;
}


//custom method to generate JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    )
}

module.exports = mongoose.model("User", userSchema)