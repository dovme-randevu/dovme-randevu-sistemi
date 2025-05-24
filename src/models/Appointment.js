const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tattoo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tattoo',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Lütfen bir tarih seçin']
    },
    notes: {
        type: String,
        maxlength: [500, 'Notlar 500 karakterden uzun olamaz']
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Sanal alanlar
AppointmentSchema.virtual('endTime').get(function() {
    return new Date(this.date.getTime() + this.duration * 60000);
});

// İndeksler
AppointmentSchema.index({ date: 1, user: 1 });
AppointmentSchema.index({ user: 1, status: 1 });
AppointmentSchema.index({ status: 1 });

// Unique validator
AppointmentSchema.plugin(mongooseUniqueValidator);

// Middleware
AppointmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Statik metodlar
AppointmentSchema.statics.getArtistAppointments = function(artistId, startDate, endDate) {
    return this.find({
        user: artistId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('user tattoo');
};

AppointmentSchema.statics.getClientAppointments = function(clientId) {
    return this.find({ user: clientId })
        .populate('user tattoo')
        .sort({ date: -1 });
};

// Instance metodlar
AppointmentSchema.methods.cancel = async function(reason) {
    if (this.status === 'completed') {
        throw new Error('Tamamlanmış randevu iptal edilemez');
    }
    
    this.status = 'cancelled';
    this.notes = reason ? `${this.notes}\nİptal nedeni: ${reason}` : this.notes;
    return this.save();
};

AppointmentSchema.methods.confirm = async function() {
    if (this.status !== 'pending') {
        throw new Error('Sadece bekleyen randevular onaylanabilir');
    }
    
    this.status = 'confirmed';
    return this.save();
};

AppointmentSchema.methods.complete = async function() {
    if (this.status !== 'confirmed') {
        throw new Error('Sadece onaylanmış randevular tamamlanabilir');
    }
    
    this.status = 'completed';
    return this.save();
};

module.exports = mongoose.model('Appointment', AppointmentSchema); 