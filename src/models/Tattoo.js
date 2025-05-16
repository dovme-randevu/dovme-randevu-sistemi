const mongoose = require('mongoose');

const tattooSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  style: {
    type: String,
    required: true,
    enum: ['Traditional', 'Realistic', 'Watercolor', 'Geometric', 'Minimalist', 'Other']
  },
  size: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tattoo', tattooSchema);