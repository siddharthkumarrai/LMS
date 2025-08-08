import express, { urlencoded } from "express";
import { pathToRegexp } from 'path-to-regexp';
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRoutes from "./routes/course.route.js";
import Razorpay from "razorpay"
import paymentRoutes from "./routes/payment.route.js";


const app = express();
pathToRegexp('/*splat') // Matches any path segments for wildcard route


app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/courses",courseRoutes)
app.use("/api/v1/payments",paymentRoutes)

app.use("/ping",(req,res)=>{
    res.status(200).send("/PONG");
});

// wildcard route for 404 error handling
app.all("/{*splat}",(req,res)=>{
    res.status(404).send("404 OOPS! page not found");
});

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(errorMiddleware)

export default app;