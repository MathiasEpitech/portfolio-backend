const express = require('express');
const { 
    addProjet, 
    getProjets, 
    updateProjet, 
    deleteProjet 
} = require('../controllers/projetController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../config/multerConfig');
const router = express.Router();

router.get('/', getProjets);

router.post('/', authMiddleware, upload.array('images', 5), addProjet); // Jusqu'à 5 images

// Modifier un projet
router.put('/:id', authMiddleware, upload.array('images', 5), updateProjet);

// Supprimer un projet
router.delete('/:id', authMiddleware, deleteProjet);

module.exports = router;
