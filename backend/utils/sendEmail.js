const nodeMailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
    
    const transporter = nodeMailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        text: message
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;