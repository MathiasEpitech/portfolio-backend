const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }],
  link: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Projet', projetSchema);
