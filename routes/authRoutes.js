const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register); // À exécuter une seule fois
router.post('/login', login);
router.post('/logout', logout); // Route pour la déconnexion

module.exports = router;
