const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Assure que chaque catégorie a un nom unique
  }
});

module.exports = mongoose.model('Category', categorySchema);
