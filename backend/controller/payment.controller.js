import CourseModel from "../models/course.model.js";
import UserModel from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import { razorpayInstance } from "../app.js";
import crypto from "crypto";
import PaymentModel from "../models/payment.model.js";

const getRazorpayApiKey = (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Razorpay API key",
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        return next(error);
    }
};

// New endpoint for free course enrollment
const enrollFreeCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const course = await CourseModel.findById(courseId);
        
        if (!course) {
            return next(new AppError("Course does not exist", 404));
        }

        const user = await UserModel.findById(userId);

        if (user.subscriptions.includes(course._id)) {
            return next(
                new AppError("You have already enrolled in this course", 400)
            );
        }

        // Create a payment record for free enrollment (for tracking purposes)
        await PaymentModel.create({
            userId,
            courseId,
            razorpay_payment_id: `FREE_${Date.now()}`,
            razorpay_order_id: `FREE_ORDER_${Date.now()}`,
            razorpay_signature: "FREE_ENROLLMENT",
            amount: 0,
            status: "success",
            paymentType: "free_enrollment"
        });

        // Add course to user's subscriptions
        user.subscriptions.push(courseId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Free course enrolled successfully!'
        });
    } catch (error) {
        return next(error);
    }
};

// Updated buySubscription to handle discounted prices
const buySubscription = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { amount, couponCode } = req.body; // Accept amount and coupon from frontend
        const userId = req.user.id;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new AppError("Course does not exist", 404));
        }

        const user = await UserModel.findById(userId);

        if (user.subscriptions.includes(course._id)) {
            return next(
                new AppError("You have already subscribed to this course", 400)
            );
        }

        // Determine the payment amount
        let paymentAmount = course.price;
        
        // If amount is provided (discounted price), validate it
        if (amount !== undefined && amount !== null) {
            // Validate that the amount is not greater than course price
            if (amount > course.price) {
                return next(new AppError("Invalid payment amount", 400));
            }
            
            // If amount is 0 or less, redirect to free enrollment
            if (amount <= 0) {
                // Handle as free enrollment instead
                await PaymentModel.create({
                    userId,
                    courseId,
                    razorpay_payment_id: `COUPON_${Date.now()}`,
                    razorpay_order_id: `COUPON_ORDER_${Date.now()}`,
                    razorpay_signature: "COUPON_ENROLLMENT",
                    amount: 0,
                    couponCode: couponCode || null,
                    status: "success",
                    paymentType: "coupon_enrollment"
                });

                user.subscriptions.push(courseId);
                await user.save();

                return res.status(200).json({
                    success: true,
                    message: 'Course enrolled successfully with 100% discount!'
                });
            }
            
            paymentAmount = amount;
        }

        // Create Razorpay order with the correct amount
        const options = {
            amount: paymentAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId: courseId,
                courseName: course.title,
                originalPrice: course.price,
                discountedPrice: paymentAmount,
                couponCode: couponCode || "",
            }
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return next(new AppError("Unable to create Payment order", 500));
        }

        return res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            order,
        });

    } catch (error) {
        return next(error);
    }
};

// Updated verifyPayment to handle discount information
const verifyPayment = async (req, res, next) => {
    try {
        const {
            courseId, 
            razorpay_payment_id, 
            razorpay_order_id, 
            razorpay_signature,
            couponCode,
            discountAmount
        } = req.body;
        const userId = req.user.id;

        if (!courseId) return next(new AppError("courseId missing", 400));

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (razorpay_signature !== generatedSignature) {
            return next(new AppError("Payment verification failed. Signature mismatch.", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) return next(new AppError("Course not found", 404));

        // Calculate the actual paid amount
        const paidAmount = discountAmount 
            ? course.price - discountAmount 
            : course.price;

        // Create payment record with discount information
        await PaymentModel.create({
            userId,
            courseId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            amount: paidAmount,
            originalAmount: course.price,
            discountAmount: discountAmount || 0,
            couponCode: couponCode || null,
            status: "success",
            paymentType: "razorpay"
        });

        const user = await UserModel.findById(userId);
        user.subscriptions.push(courseId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully! Course subscribed.'
        });
    } catch (error) {
        return next(error);
    }
};

// Optional: Add a route to validate coupon codes
const validateCoupon = async (req, res, next) => {
    try {
        const { courseId, couponCode } = req.body;
        
        if (!couponCode) {
            return next(new AppError("Coupon code is required", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        // Here you can implement your coupon validation logic
        // This is a simple example
        let discountPercentage = 0;
        let discountAmount = 0;
        
        if (couponCode.toUpperCase() === "PW2025") {
            discountPercentage = 100;
            discountAmount = course.price;
        }
        // Add more coupon codes as needed
        
        if (discountPercentage === 0) {
            return next(new AppError("Invalid coupon code", 400));
        }

        return res.status(200).json({
            success: true,
            message: "Coupon validated successfully",
            discount: {
                percentage: discountPercentage,
                amount: discountAmount,
                finalPrice: course.price - discountAmount
            }
        });
    } catch (error) {
        return next(error);
    }
};

export { 
    getRazorpayApiKey, 
    buySubscription, 
    verifyPayment,
    enrollFreeCourse,
    validateCoupon 
};