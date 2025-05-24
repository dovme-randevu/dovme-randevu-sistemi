const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen bir isim girin'],
    trim: true,
    maxlength: [50, 'İsim 50 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'Lütfen bir email girin'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Lütfen geçerli bir email girin'
    ]
  },
  password: {
    type: String,
    required: [true, 'Lütfen bir şifre girin'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[0-9]{10}$/,
      'Geçerli bir telefon numarası giriniz'
    ]
  },
  profileImage: {
    url: String,
    filename: String
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Biyografi 500 karakterden uzun olamaz']
  },
  specialties: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    min: [0, 'Deneyim 0\'dan küçük olamaz'],
    max: [100, 'Deneyim 100\'den büyük olamaz']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
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
userSchema.virtual('tattoos', {
  ref: 'Tattoo',
  localField: '_id',
  foreignField: 'artist'
});

userSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'client'
});

// İndeksler
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'rating.average': -1 });

// Unique validator
userSchema.plugin(mongooseUniqueValidator);

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
});

// JWT token oluşturma
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Şifre karşılaştırma
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Doğrulama tokeni oluşturma
userSchema.methods.getVerificationToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 saat
  return token;
};

// Şifre sıfırlama tokeni oluşturma
userSchema.methods.getResetPasswordToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 dakika
  return token;
};

// Statik metodlar
userSchema.statics.getTopArtists = function(limit = 10) {
  return this.find({ role: 'artist' })
    .sort({ 'rating.average': -1 })
    .limit(limit);
};

userSchema.statics.getArtistsBySpecialty = function(specialty) {
  return this.find({
    role: 'artist',
    specialties: specialty
  }).sort({ 'rating.average': -1 });
};

// Instance metodlar
userSchema.methods.updateRating = async function(newRating) {
  const oldTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (oldTotal + newRating) / this.rating.count;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);