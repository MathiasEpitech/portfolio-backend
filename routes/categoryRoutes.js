const express = require('express');
const {
  addCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route pour ajouter une catégorie
router.post('/', authMiddleware, addCategory);

// Route pour obtenir toutes les catégories
router.get('/', getCategories);

// Route pour supprimer une catégorie
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
