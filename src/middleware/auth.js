const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Kullanıcı doğrulama
const protect = async (req, res, next) => {
    try {
        let token;

        // Token kontrolü
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Bu işlem için giriş yapmanız gerekiyor'
            });
        }

        try {
            // Token doğrulama
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Kullanıcı kontrolü
            req.user = await User.findById(decoded.id);
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz token'
                });
            }

            next();
        } catch (error) {
            logger.error('Token doğrulama hatası:', error);
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }
    } catch (error) {
        logger.error('Auth middleware hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// Admin yetkisi kontrolü
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekiyor'
        });
    }
};

module.exports = { protect, admin };