const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = async (email, confirmationUrl) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Account Confirmation',
        text: `Please confirm your account by clicking the link: ${confirmationUrl}`,
    };

    await transporter.sendMail(mailOptions);
};
