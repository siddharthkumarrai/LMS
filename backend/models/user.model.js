import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = Schema({
    name: {
        type: String,
        trim: true,
        lowerCase: true,
        required: [true, "name is required"],
        minLength: [4, "Minimum 4 character is required in Name"],
        maxLength: [25, "Maximum 25 character is required in name"]
    },
    email: {
        type: String,
        trim: true,
        lowerCase: true,
        required: [true, 'Email address is required'],
        unique: true,
        match: [
            /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
            'Please provide a valid email address (e.g., user@gmail.com)'  // Error message
        ]
    },
    password: {
        type: String,
        select: false,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Minimum 8 character is required in Password"],
    },
    avatar: {
        publicId: {
            type: String,
            required: true
        },
        secureUrl: {
            type: String,
            required: true
        }
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    role: {
        type: String,
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'] // Taaki in teen ke alawa koi aur value na daal sake
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    address: {
        state: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,

},
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods = {
    generateJwtToken() {
        return jwt.sign(
            {
                id: this._id,
                name: this.name,
                email: this.email,
                role: this.role,
            },
            process.env.SECRET,
            {
                expiresIn: '24h'
            }
        )
    },

    async comparePassword(password) {
        return await bcrypt.compare(password, this.password)
    },

    generateForgotPasswordToken() {
        const forgetPasswordToken = crypto.randomBytes(64).toString('hex');

        this.forgotPasswordToken = crypto.createHash('sha256').update(forgetPasswordToken).digest('hex')
        this.forgotPasswordTokenExpiry = Date.now() + 1000 * 60 * 15 // in ms

        return forgetPasswordToken



    }
}

const UserModel = mongoose.model("User", userSchema)

export default UserModel;