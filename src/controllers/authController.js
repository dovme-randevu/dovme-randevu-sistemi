const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Email kontrolü
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanılıyor'
            });
        }

        // Kullanıcı oluştur
        user = await User.create({
            name,
            email,
            password
        });

        // Token oluştur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
        logger.error('Kullanıcı kaydı hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı kaydı sırasında bir hata oluştu'
        });
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen email ve şifre girin'
            });
        }

        // Kullanıcı kontrolü
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Şifre kontrolü
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Token oluştur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            token
        });
    } catch (error) {
        logger.error('Kullanıcı girişi hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş sırasında bir hata oluştu'
        });
    }
};

// @desc    Giriş yapmış kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Kullanıcı bilgileri getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgileri getirilirken bir hata oluştu'
        });
    }
};

// @desc    Email doğrulama
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const verificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            logger.error('Geçersiz veya süresi dolmuş doğrulama tokeni');
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veya süresi dolmuş token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        logger.info('Email doğrulandı:', user.email);

        res.status(200).json({
            success: true,
            message: 'Email başarıyla doğrulandı'
        });
    } catch (err) {
        logger.error('Email doğrulama hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Şifre sıfırlama emaili gönder
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            logger.error('Şifre sıfırlama için kullanıcı bulunamadı:', req.body.email);
            return res.status(404).json({
                success: false,
                message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
            });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `
            Merhaba ${user.name},
            Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
            ${resetUrl}
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Şifre Sıfırlama',
                message
            });

            logger.info('Şifre sıfırlama emaili gönderildi:', user.email);

            res.status(200).json({
                success: true,
                message: 'Şifre sıfırlama emaili gönderildi'
            });
        } catch (err) {
            logger.error('Şifre sıfırlama emaili gönderme hatası:', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: 'Email gönderilemedi'
            });
        }
    } catch (err) {
        logger.error('Şifre sıfırlama hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Şifre sıfırlama
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            logger.error('Geçersiz veya süresi dolmuş şifre sıfırlama tokeni');
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veya süresi dolmuş token'
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        logger.info('Şifre sıfırlandı:', user.email);

        res.status(200).json({
            success: true,
            message: 'Şifre başarıyla sıfırlandı'
        });
    } catch (err) {
        logger.error('Şifre sıfırlama hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Şifre güncelleme
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Mevcut şifre kontrolü
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            logger.error('Geçersiz mevcut şifre:', req.user.id);
            return res.status(401).json({
                success: false,
                message: 'Mevcut şifre yanlış'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        logger.info('Şifre güncellendi:', user.email);

        res.status(200).json({
            success: true,
            message: 'Şifre başarıyla güncellendi'
        });
    } catch (err) {
        logger.error('Şifre güncelleme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Profil güncelleme
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
        };

        if (req.file) {
            fieldsToUpdate.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        logger.info('Profil güncellendi:', user.email);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profileImage: user.profileImage,
                bio: user.bio
            }
        });
    } catch (err) {
        logger.error('Profil güncelleme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};