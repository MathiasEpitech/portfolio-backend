const express = require('express');
const {
  addCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addCategory);

router.get('/', getCategories);

router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
