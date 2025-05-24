const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const tattooSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dövme adı zorunludur'],
    trim: true,
    maxlength: [100, 'Dövme adı 100 karakterden uzun olamaz']
  },
  description: {
    type: String,
    required: [true, 'Dövme açıklaması zorunludur'],
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  }],
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['traditional', 'realistic', 'geometric', 'watercolor', 'minimalist', 'other'],
    default: 'other'
  },
  size: {
    width: {
      type: Number,
      required: [true, 'Genişlik zorunludur'],
      min: [1, 'Genişlik 1cm\'den küçük olamaz'],
      max: [100, 'Genişlik 100cm\'den büyük olamaz']
    },
    height: {
      type: Number,
      required: [true, 'Yükseklik zorunludur'],
      min: [1, 'Yükseklik 1cm\'den küçük olamaz'],
      max: [100, 'Yükseklik 100cm\'den büyük olamaz']
    }
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur'],
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sanatçı zorunludur']
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'archived'],
    default: 'available'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
tattooSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// İndeksler
tattooSchema.index({ name: 'text', description: 'text' });
tattooSchema.index({ category: 1, status: 1 });
tattooSchema.index({ artist: 1, status: 1 });

// Unique validator
tattooSchema.plugin(mongooseUniqueValidator);

// Middleware
tattooSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Statik metodlar
tattooSchema.statics.getPopularTattoos = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'available' } },
    { $addFields: { likeCount: { $size: '$likes' } } },
    { $sort: { likeCount: -1 } },
    { $limit: limit }
  ]);
};

tattooSchema.statics.getTattoosByCategory = function(category, limit = 10) {
  return this.find({ category, status: 'available' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance metodlar
tattooSchema.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  return this.save();
};

module.exports = mongoose.model('Tattoo', tattooSchema); 