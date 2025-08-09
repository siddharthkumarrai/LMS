import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { buySubscription, enrollFreeCourse, getRazorpayApiKey, validateCoupon, verifyPayment } from "../controller/payment.controller.js";

const paymentRoutes = express.Router()

paymentRoutes
    .route('/razorpay-key')
    .get(getRazorpayApiKey)

paymentRoutes
    .route("/subscribe/:courseId")
    .post(isLoggedIn,buySubscription)

// **Add this line:**
paymentRoutes.route("/verify").post(isLoggedIn, verifyPayment);

paymentRoutes.route("/enroll-free/:courseId").post(isLoggedIn, enrollFreeCourse);
paymentRoutes.route("/validate-coupon").post(isLoggedIn, validateCoupon);


export default paymentRoutes