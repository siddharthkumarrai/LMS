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

// =======================================================
// RENDER.COM HEALTH CHECK ROUTE (Server ko zinda rakhne ke liye)
// =======================================================
app.get("/render-alive", (req, res) => {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Server Status</title>
            <style>
                body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #2c3e50; color: white; }
                .card { text-align: center; padding: 50px; background-color: #34495e; border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
                .status { color: #2ecc71; font-size: 28px; font-weight: bold; }
                .msg { font-size: 18px; margin-top: 10px; }
                .time { font-size: 12px; color: #95a5a6; margin-top: 25px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="status">● Online</div>
                <div class="msg">Backend server is up and running!</div>
                <div class="time">Last Checked: ${timestamp} (IST)</div>
            </div>
        </body>
        </html>
    `;
    res.status(200).send(htmlResponse);
});
// =======================================================


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