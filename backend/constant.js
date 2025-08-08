// We are creating a function that takes a URL and returns the HTML
export const forgotPasswordMessage = (forgotPasswordUrl) => {
  // Now, forgotPasswordUrl is a parameter we receive from the controller
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Your CSS styles remain the same */
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #dddddd; }
            .header h1 { margin: 0; color: #333333; }
            .content { padding: 20px 0; line-height: 1.6; color: #555555; }
            .button-container { text-align: center; padding: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #dddddd; font-size: 12px; color: #999999; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>YourApp</h1></div>
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset the password for your account. Please click the button below to reset your password.</p>
                <p>This link is valid for the next <strong>15 minutes</strong>.</p>
            </div>
            <div class="button-container">
                <a href="${forgotPasswordUrl}" class="button">Reset Password</a>
            </div>
            <div class="content">
                <p>If the button above doesn't work, copy/paste this URL into your browser:</p>
                <p><a href="${forgotPasswordUrl}">${forgotPasswordUrl}</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} YourApp. All rights reserved.</p>
                <p>Noida, Uttar Pradesh, India</p>
            </div>
        </div>
    </body>
    </html>
  `;
};