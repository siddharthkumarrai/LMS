import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
})

const PaymentModel = mongoose.model("Payment",paymentSchema)

export default PaymentModel;