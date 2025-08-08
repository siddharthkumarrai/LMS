import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { buySubscription, getRazorpayApiKey, verifyPayment } from "../controller/payment.controller.js";

const paymentRoutes = express.Router()

paymentRoutes
    .route('/razorpay-key')
    .get(getRazorpayApiKey)

paymentRoutes
    .route("/subscribe/:courseId")
    .post(isLoggedIn,buySubscription)

// **Add this line:**
paymentRoutes.route("/verify").post(isLoggedIn, verifyPayment);


export default paymentRoutes