import sendEmail from '../utils/sendEmail.js';
import AppError from '../utils/error.util.js';

export const contactUs = async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError('All fields are required', 400));
    }

    try {
        const subject = `New Contact Form Query from ${name}`;
        const emailMessage = `
            <h2>You have a new query from your LMS website!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

        await sendEmail({
            to: process.env.CONTACT_US_EMAIL,
            fromName: name, // User as sender name
            subject,
            message: emailMessage,
        });

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully!',
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};