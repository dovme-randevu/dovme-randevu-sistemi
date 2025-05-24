const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// @route   GET /api/appointments
// @desc    Tüm randevuları getir
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        await appointmentController.getAppointments(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/appointments/:id
// @desc    Tek bir randevu detayını getir
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        await appointmentController.getAppointment(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/appointments
// @desc    Yeni randevu oluştur
// @access  Private
router.post(
    '/',
    [
        protect,
        body('tattoo', 'Dövme ID gerekli').not().isEmpty(),
        body('date', 'Tarih gerekli').not().isEmpty(),
        body('notes', 'Notlar gerekli').optional()
    ],
    async (req, res, next) => {
        try {
            await appointmentController.createAppointment(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// @route   PUT /api/appointments/:id
// @desc    Randevu güncelle
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    try {
        await appointmentController.updateAppointment(req, res);
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/appointments/:id
// @desc    Randevu iptal et
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        await appointmentController.cancelAppointment(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;