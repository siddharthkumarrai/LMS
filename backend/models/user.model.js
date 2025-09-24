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
        maxLength: [50, "Maximum 50 character is required in name"]
    },
    email: {
        type: String,
        trim: true,
        lowerCase: true,
        required: [true, 'Email address is required'],
        unique: true,
        match: [
            /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
            'Please provide a valid email address (e.g., user@gmail.com)'
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
            required: true,
            default: function() {
                return `default_${this.email}`;
            }
        },
        secureUrl: {
            type: String,
            required: true,
            default: function() {
                const firstChar = this.name ? this.name.charAt(0).toUpperCase() : 'U';
                return `https://ui-avatars.com/api/?name=${firstChar}&background=3b82f6&color=ffffff&size=250&font-size=0.6&bold=true&format=png`;
            }
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
        enum: ['Male', 'Female', 'Other']
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
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    githubId: {
        type: String,
        sparse: true,
        unique: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

// Pre-save middleware to handle default avatar generation
userSchema.pre("save", async function (next) {
    // Handle default avatar generation if avatar is not set or is using default
    if (this.isNew || this.isModified('name')) {
        const isDefaultAvatar = this.avatar.publicId.startsWith('default_');
        
        if (this.isNew || isDefaultAvatar) {
            const firstChar = this.name ? this.name.charAt(0).toUpperCase() : 'U';
            
            // Only update if it's a new document or if using default avatar
            if (this.isNew) {
                this.avatar.publicId = `default_${this.email}`;
            }
            
            if (this.isNew || isDefaultAvatar) {
                this.avatar.secureUrl = `https://ui-avatars.com/api/?name=${firstChar}&background=3b82f6&color=ffffff&size=250&font-size=0.6&bold=true&format=png`;
            }
        }
    }

    // Skip password hashing for OAuth users
    if (this.authProvider !== 'local' && !this.password) {
        return next();
    }
    
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Make password optional for OAuth users
userSchema.path('password').required(function() {
    return this.authProvider === 'local';
});

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