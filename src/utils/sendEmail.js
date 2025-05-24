const nodemailer = require('nodemailer');
const logger = require('./logger');

const sendEmail = async (options) => {
    try {
        // Email gönderici oluştur
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email seçenekleri
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        // Email gönder
        const info = await transporter.sendMail(mailOptions);
        logger.info('Email gönderildi:', {
            messageId: info.messageId,
            to: options.email
        });

        return info;
    } catch (err) {
        logger.error('Email gönderme hatası:', err);
        throw err;
    }
};

module.exports = sendEmail; 