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

const buySubscription = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const course = await CourseModel.findById(courseId);

        console.log(course);


        if (!course) {
            return next(new AppError("Course does not exist", 404));
        }

        const user = await UserModel.findById(userId);

        console.log(user);

        console.log(user.subscriptions.includes(course._id));


        if (user.subscriptions.includes(course._id)) {
            return next(
                new AppError("You have already subscribed to this course", 400)
            );
        }

        const options = {
            amount: course.price * 100, // Amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        console.log(order);


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

const verifyPayment = async (req, res, next) => {
    try {
        const {courseId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
        const userId = req.user.id

        if (!courseId) return next(new AppError("courseId missing", 400));

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (razorpay_signature !== generatedSignature) {
            return next(new AppError("Payment verification failed. Signature mismatch.", 400))
        }

        const course = await CourseModel.findById(courseId);
        if (!course) return next(new AppError("Course not found", 404));

        await PaymentModel.create({
            userId,
            courseId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            amount: course.price,
            status: "success"
        })

        const user = await UserModel.findById(userId)
        user.subscriptions.push(courseId)

        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully! Course subscribed.'
        });
    } catch (error) {
        return next(error)
    }
}

export { getRazorpayApiKey, buySubscription, verifyPayment };
