const { validationResult } = require('express-validator');
const Tattoo = require('../models/Tattoo');
const logger = require('../utils/logger');
const { processImage } = require('../utils/fileUpload');
const fs = require('fs');

// @desc    Tüm dövmeleri getir
// @route   GET /api/tattoos
// @access  Public
exports.getTattoos = async (req, res) => {
    try {
        const tattoos = await Tattoo.find();
        res.json({
            success: true,
            count: tattoos.length,
            data: tattoos
        });
    } catch (error) {
        logger.error('Dövmeler getirilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Dövmeler getirilirken bir hata oluştu'
        });
    }
};

// @desc    Tek bir dövme detayını getir
// @route   GET /api/tattoos/:id
// @access  Public
exports.getTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.findById(req.params.id);
        
        if (!tattoo) {
            return res.status(404).json({
                success: false,
                message: 'Dövme bulunamadı'
            });
        }

        res.json({
            success: true,
            data: tattoo
        });
    } catch (error) {
        logger.error('Dövme detayı getirilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Dövme detayı getirilirken bir hata oluştu'
        });
    }
};

// @desc    Yeni dövme ekle
// @route   POST /api/tattoos
// @access  Private
exports.createTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.create(req.body);
        
        res.status(201).json({
            success: true,
            data: tattoo
        });
    } catch (error) {
        logger.error('Dövme oluşturulurken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Dövme oluşturulurken bir hata oluştu'
        });
    }
};

// @desc    Dövme güncelle
// @route   PUT /api/tattoos/:id
// @access  Private
exports.updateTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!tattoo) {
            return res.status(404).json({
                success: false,
                message: 'Dövme bulunamadı'
            });
        }

        res.json({
            success: true,
            data: tattoo
        });
    } catch (error) {
        logger.error('Dövme güncellenirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Dövme güncellenirken bir hata oluştu'
        });
    }
};

// @desc    Dövme sil
// @route   DELETE /api/tattoos/:id
// @access  Private
exports.deleteTattoo = async (req, res) => {
    try {
        const tattoo = await Tattoo.findByIdAndDelete(req.params.id);

        if (!tattoo) {
            return res.status(404).json({
                success: false,
                message: 'Dövme bulunamadı'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        logger.error('Dövme silinirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Dövme silinirken bir hata oluştu'
        });
    }
};

// @desc    Dövme beğen/beğenmekten vazgeç
// @route   PUT /api/tattoos/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
    try {
        const tattoo = await Tattoo.findById(req.params.id);
        if (!tattoo) {
            logger.error('Dövme bulunamadı:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Dövme bulunamadı'
            });
        }

        await tattoo.toggleLike(req.user.id);

        logger.info('Dövme beğeni durumu değiştirildi:', {
            id: tattoo._id,
            userId: req.user.id
        });

        res.status(200).json({
            success: true,
            data: tattoo
        });
    } catch (err) {
        logger.error('Dövme beğeni hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Popüler dövmeleri getir
// @route   GET /api/tattoos/popular
// @access  Public
exports.getPopularTattoos = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const tattoos = await Tattoo.getPopularTattoos(limit);

        res.status(200).json({
            success: true,
            count: tattoos.length,
            data: tattoos
        });
    } catch (err) {
        logger.error('Popüler dövmeleri getirme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Kategoriye göre dövmeleri getir
// @route   GET /api/tattoos/category/:category
// @access  Public
exports.getTattoosByCategory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const tattoos = await Tattoo.getTattoosByCategory(req.params.category, limit);

        res.status(200).json({
            success: true,
            count: tattoos.length,
            data: tattoos
        });
    } catch (err) {
        logger.error('Kategori dövmelerini getirme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};