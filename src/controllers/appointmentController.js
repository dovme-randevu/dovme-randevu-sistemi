const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Tattoo = require('../models/Tattoo');
const User = require('../models/User');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');

// @desc    Tüm randevuları getir
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id })
            .populate('tattoo', 'name imageUrl price duration')
            .sort('-date');

        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        logger.error('Randevular getirilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Randevular getirilirken bir hata oluştu'
        });
    }
};

// @desc    Tek bir randevu detayını getir
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('tattoo', 'name imageUrl price duration');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        // Kullanıcı kontrolü
        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu randevuyu görüntüleme yetkiniz yok'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        logger.error('Randevu detayı getirilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Randevu detayı getirilirken bir hata oluştu'
        });
    }
};

// @desc    Yeni randevu oluştur
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    try {
        // Dövme kontrolü
        const tattoo = await Tattoo.findById(req.body.tattoo);
        if (!tattoo) {
            return res.status(404).json({
                success: false,
                message: 'Dövme bulunamadı'
            });
        }

        // Tarih kontrolü
        const appointmentDate = new Date(req.body.date);
        if (appointmentDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Geçmiş bir tarih seçemezsiniz'
            });
        }

        // Randevu oluştur
        const appointment = await Appointment.create({
            ...req.body,
            user: req.user.id,
            price: tattoo.price,
            duration: tattoo.duration
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        logger.error('Randevu oluşturulurken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Randevu oluşturulurken bir hata oluştu'
        });
    }
};

// @desc    Randevu güncelle
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        // Kullanıcı kontrolü
        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu randevuyu güncelleme yetkiniz yok'
            });
        }

        // Tarih kontrolü
        if (req.body.date) {
            const appointmentDate = new Date(req.body.date);
            if (appointmentDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçmiş bir tarih seçemezsiniz'
                });
            }
        }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        logger.error('Randevu güncellenirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Randevu güncellenirken bir hata oluştu'
        });
    }
};

// @desc    Randevu iptal et
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Randevu bulunamadı'
            });
        }

        // Kullanıcı kontrolü
        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu randevuyu iptal etme yetkiniz yok'
            });
        }

        await appointment.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        logger.error('Randevu iptal edilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Randevu iptal edilirken bir hata oluştu'
        });
    }
};

// @desc    Sanatçının randevularını getir
// @route   GET /api/appointments/artist/:artistId
// @access  Private
exports.getArtistAppointments = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const appointments = await Appointment.getArtistAppointments(
            req.params.artistId,
            new Date(startDate),
            new Date(endDate)
        );

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        logger.error('Sanatçı randevularını getirme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// @desc    Müşterinin randevularını getir
// @route   GET /api/appointments/client/:clientId
// @access  Private
exports.getClientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.getClientAppointments(req.params.clientId);

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        logger.error('Müşteri randevularını getirme hatası:', err);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};