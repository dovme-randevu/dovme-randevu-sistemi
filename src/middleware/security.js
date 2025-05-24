const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Güvenlik middleware'lerini uygula
exports.applySecurityMiddleware = (app) => {
    // CORS
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    }));

    // Güvenlik başlıkları
    app.use(helmet());

    // XSS koruması
    app.use(xss());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 dakika
        max: process.env.RATE_LIMIT_MAX || 100 // IP başına limit
    });
    app.use('/api/', limiter);

    // HTTP Parameter Pollution koruması
    app.use(hpp());
}; 