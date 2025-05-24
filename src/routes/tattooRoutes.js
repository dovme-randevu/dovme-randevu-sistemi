const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tattooController = require('../controllers/tattooController');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

// @route   GET /api/tattoos
// @desc    Tüm dövmeleri getir
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        await tattooController.getTattoos(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/tattoos/:id
// @desc    Tek bir dövme detayını getir
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        await tattooController.getTattoo(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/tattoos
// @desc    Yeni dövme ekle
// @access  Private
router.post(
    '/',
    [
        protect,
        admin,
        body('name', 'İsim gerekli').not().isEmpty(),
        body('description', 'Açıklama gerekli').not().isEmpty(),
        body('imageUrl', 'Resim URL gerekli').not().isEmpty(),
        body('category', 'Kategori gerekli').not().isEmpty(),
        body('price', 'Fiyat gerekli').isNumeric(),
        body('duration', 'Süre gerekli').isNumeric()
    ],
    async (req, res, next) => {
        try {
            await tattooController.createTattoo(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// @route   PUT /api/tattoos/:id
// @desc    Dövme güncelle
// @access  Private
router.put('/:id', [protect, admin], async (req, res, next) => {
    try {
        await tattooController.updateTattoo(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/tattoos/:id
// @desc    Dövme sil
// @access  Private
router.delete('/:id', [protect, admin], async (req, res, next) => {
    try {
        await tattooController.deleteTattoo(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;