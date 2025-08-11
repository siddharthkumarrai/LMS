import UserModel from "../models/user.model.js"
import CourseModel from "../models/course.model.js"; 
import AppError from "../utils/error.util.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendForgotPasswordEmail from "../utils/sendForgotPasswordEmails.js"
import { forgotPasswordMessage } from "../constant.js"
import crypto from "crypto";
import { log } from "console"

const register = async function (req, res, next, role = "user") {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const userExits = await UserModel.findOne({ email });

        if (userExits) {
            return next(new AppError("user already exists", 400));
        };

        let user = await UserModel({
            name,
            email,
            password,
            role,
            avatar: {
                publicId: email,
                secureUrl: `https://res.cloudinary.com/dnknslaku/image/upload/v1753346861/lms/gcjaot4wf4z9q1hmx4mx.jpg`
            }
        });

        if (!user) {
            return next(new AppError("user registration failed", 400))
        }

        console.log(req.file)

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: "lms/avatar", width: 250, height: 250, gravity: "face", crop: "fill" })

                console.log(result);



                if (result) {
                    user.avatar.publicId = result.public_id,
                        user.avatar.secureUrl = result.secure_url
                }

                fs.rm(req.file.path, { recursive: true })

            } catch (error) {
                return next(new AppError("No file uploaded. Please select a file.", 401))
            }
        }

        const userData = await user.save();
        userData.password = undefined;

        const token = user.generateJwtToken()

        if (!token) {
            return next(new AppError("Failed to generate authentication token. Please try again.", 500))
        }

        res.cookie("token", token, { expires: new Date(Date.now() + (60 * 60 * 24)), httpOnly: true })

        return res.status(200).json({
            success: true,
            message: "user successfully registerd",
            userData
        })

    } catch (error) {
        return next(error)
    }
}

const login = async function (req, res, next) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new AppError("email and password are required", 400));
        }

        const user = await UserModel.findOne({ email }).select("+password")

        if (!user || ! await user.comparePassword(password)) {
            return next(new AppError("invalid credentials", 400))
        }

        const token = user.generateJwtToken()

        if (!token) {
            return next(new AppError("Failed to generate authentication token. Please try again.", 500))
        }

        res.cookie("token", token, { expires: new Date(Date.now() + (60 * 60 * 24)), httpOnly: true })

        user.password = undefined

        return res.status(200).json({
            success: true,
            message: "user successfully login",
            token,
            user
        })

    } catch (error) {
        return next(error)
    }
}

const getMyProfile = async function (req, res, next) {
    try {
        const userId = req.user.id;
        if (!userId) {
            return next(new AppError("Please login to see profile", 400));
        }

        const user = await UserModel.findById(userId).populate({
            path: 'subscriptions', // Pehle 'subscriptions' ko populate karo
            populate: {
                path: 'createdBy', // Fir har subscription ke andar 'createdBy' ko populate karo
                select: 'name'     // Aur sirf naam select karo
            }
        });
        

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return next(error)
    }

}

const logout = function (req, res, next) {
    try {
        res.cookie("token", null, { httpOnly: true, expires: new Date(0) })
        return res.status(200).json({
            success: true,
            message: "user successfully logout"
        })
    } catch (error) {
        return next(error)
    }

}

const forgotPassword = async function (req, res, next) {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return next(new AppError("invalid email", 401));
        }

        const forgotPasswordToken = user.generateForgotPasswordToken();

        await user.save()

        // In your backend forgotPassword controller
        const forgotPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${forgotPasswordToken}`
        // Changed from: /forgotPassword/ to: /reset-password/

        const subject = `Forgot Password Request`;
        const message = forgotPasswordMessage(forgotPasswordUrl)

        try {
            await sendForgotPasswordEmail(email, subject, message)

            return res.status(200).json({
                success: true,
                message: `forgotpassword token has been sent to ${email} successfully`
            })
        } catch (error) {
            user.forgotPasswordToken = undefined;
            user.forgotPasswordTokenExpiry = undefined;

            await user.save()

            return next(new AppError(error.message, 500));
        }

    } catch (error) {
        next(error)
    }
}

const resetPassword = async function (req, res, next) {

    try {
        const { resetToken } = req.params;
        const { newPassword } = req.body;

        const newToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        const user = await UserModel.findOne({ forgotPasswordToken: newToken, forgotPasswordTokenExpiry: { $gt: Date.now() } })
        console.log(user);

        if (!user) {
            return next(new AppError("invalid token", 401));
        }

        user.password = newPassword;
        console.log(user.password);

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save()

        return res.status(200).json({
            success: true,
            message: "password successfully changed"
        })
    } catch (error) {
        return next(error)
    }



}

const changePassword = async function (req, res, next) {
    try {
        const { id } = req.user;

        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return next(new AppError("oldPassword and newPassword are required"))
        }

        const user = await UserModel.findById(id).select("+password")
        console.log(user);

        if (!user) {
            return next(new AppError("plese login to change password", 401))
        }

        const isPasswordValid = await user.comparePassword(oldPassword)

        if (!isPasswordValid) {
            return next(new AppError("invalid password", 401))
        }

        user.password = newPassword
        await user.save()

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "password change successfully"
        })
    } catch (error) {
        return next(error)
    }

}

const updateProfile = async function (req, res, next) {
    try {
        console.log("Request body:", req.body);
        const { id } = req.user;
        const { name, gender, contactNumber } = req.body

        const user = await UserModel.findById(id);

        if (!user) {
            return next(new AppError("User not found", 401));
        }

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (contactNumber) user.contactNumber = contactNumber;

        if (req.body.address) {
            const { state, city, pincode } = req.body.address;
            if (!user.address) user.address = {};
            if (state) user.address.state = state;
            if (city) user.address.city = city;
            if (pincode) user.address.pincode = pincode;
        }


        if (req.file) {
            console.log(user.avatar.publicId);

            await cloudinary.v2.uploader.destroy(user.avatar.publicId)
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: "lms", width: 250, height: 250, gravity: "face", crop: "fill" })

                if (result) {
                    user.avatar.publicId = result.public_id,
                        user.avatar.secureUrl = result.secure_url
                }

                fs.rm(req.file.path, { recursive: true })

            } catch (error) {
                next(new AppError(error || "No file uploaded. Please select a file.", 401))
            }
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        })
    } catch (error) {
        return next(error)
    }
}

// Register Admin user
export const adminRegister = function (req, res, next) {
    register(req, res, next, "admin")
}



// Get all enrolled students with their course details

const getEnrolledStudents = async function (req, res, next) {
    try {
        console.log('🔍 Fetching enrolled students...');

        // Query for users with role 'user' and non-empty subscriptions array
        const enrolledUsers = await UserModel.find({
            role: 'user',
            subscriptions: { $exists: true, $not: { $size: 0 } }
        })
        .select('name email subscriptions') // Only select necessary user fields
        .populate({
            path: 'subscriptions',
            select: 'title category price', // Only select required course fields
            match: { _id: { $exists: true } } // Ensure valid course references
        })
        .lean(); // Use lean() for better performance since we're only reading

        console.log(`📊 Found ${enrolledUsers.length} users with subscriptions`);

        // Transform the data into the required flat array structure
        const enrollmentRecords = [];

        enrolledUsers.forEach(user => {
            // Handle cases where subscriptions might have null/invalid references
            const validSubscriptions = user.subscriptions.filter(course => course !== null);
            
            validSubscriptions.forEach(course => {
                enrollmentRecords.push({
                    student: {
                        name: user.name,
                        email: user.email
                    },
                    course: {
                        title: course.title,
                        category: course.category,
                        price: course.price
                    }
                });
            });
        });

        console.log(`✅ Generated ${enrollmentRecords.length} enrollment records`);

        // Check if no enrolled students found
        if (enrollmentRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No enrolled students found"
            });
        }

        // Return successful response with enrollment data
        return res.status(200).json({
            success: true,
            message: `Found ${enrollmentRecords.length} enrollment records`,
            data: enrollmentRecords,
            totalStudents: enrolledUsers.length,
            totalEnrollments: enrollmentRecords.length
        });

    } catch (error) {
        console.error('❌ Error in getEnrolledStudents:', error);
        return next(error);
    }
};



export {
    register,
    login,
    getMyProfile,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    getEnrolledStudents
}