const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Tüm kullanıcıları sil (sadece test için)
// @route   DELETE /api/auth/clear-users
// @access  Public
router.delete('/clear-users', async (req, res, next) => {
    try {
        await User.deleteMany({});
        res.json({ 
            success: true, 
            message: 'Tüm kullanıcılar silindi' 
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/register
// @desc    Kullanıcı kaydı
// @access  Public
router.post(
    '/register',
    [
        body('name', 'İsim gerekli').not().isEmpty(),
        body('email', 'Geçerli bir email giriniz').isEmail(),
        body('password', 'Şifre en az 6 karakter olmalıdır').isLength({ min: 6 })
    ],
    async (req, res, next) => {
        try {
            await authController.register(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post(
    '/login',
    [
        body('email', 'Geçerli bir email giriniz').isEmail(),
        body('password', 'Şifre gerekli').exists()
    ],
    async (req, res, next) => {
        try {
            await authController.login(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// @route   GET /api/auth/me
// @desc    Giriş yapmış kullanıcı bilgilerini getir
// @access  Private
router.get('/me', protect, async (req, res, next) => {
    try {
        await authController.getMe(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;