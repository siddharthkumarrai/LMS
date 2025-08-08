import nodemailer from "nodemailer";
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.AUTHOR_EMAIL,
    pass: process.env.AUTHER_APP_PASSWORD,
  },
});

const sendForgotPasswordEmail = async function (email, subject, message) {

  const info = await transporter.sendMail({
    from: process.env.AUTHOR_EMAIL, //sender
    to: email, //reciver
    subject: subject,
    html: message, // HTML body
  });

  console.log("Message sent:", info.messageId);
}


export default sendForgotPasswordEmail;