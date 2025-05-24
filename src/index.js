const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { applySecurityMiddleware } = require('./middleware/security');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Güvenlik middleware'lerini uygula
applySecurityMiddleware(app);

// Loglama
app.use(morgan('combined', { stream: logger.stream }));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Statik dosyaları sun
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const authRoutes = require('./routes/authRoutes');
const tattooRoutes = require('./routes/tattooRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Route'ları uygula
app.use('/api/auth', authRoutes);
app.use('/api/tattoos', tattooRoutes);
app.use('/api/appointments', appointmentRoutes);

// Ana sayfa
app.get('/', (req, res) => {
    res.json({ 
        message: 'Tattoo Site API',
        version: '1.0.0',
        status: 'active'
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Sayfa bulunamadı'
    });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısı ve sunucuyu başlatma
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV}`);
            logger.info(`Test URL: http://localhost:${PORT}/test`);
            logger.info(`API URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Server başlatılamadı:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM sinyali alındı. Sunucu kapatılıyor...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Yakalanmamış hata:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('İşlenmemiş promise reddi:', error);
    process.exit(1);
});

startServer();