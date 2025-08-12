import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Email ke options define karo
    const mailOptions = {
        from: `"${options.fromName}" <${process.env.SMTP_USER}>`, // sender email
        to: options.to, // reciver
        subject: options.subject, // Subject
        html: options.message, // HTML body
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;