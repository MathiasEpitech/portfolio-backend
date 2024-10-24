const Category = require('../models/Category');
const Projet = require('../models/Projet');
const { uploadToS3 } = require('../function/uploadImageFunction');

exports.addProjet = async (req, res) => {
    const { title, description, category, link } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Aucune image téléchargée." });
    }

    try {
        if (!category || category.length === 0) {
            return res.status(400).json({ message: 'Une catégorie est requise.' });
        }

        const existingCategories = await Category.find({ _id: { $in: category } });
        if (existingCategories.length === 0) {
            return res.status(404).json({ message: 'Une ou plusieurs catégories non trouvées' });
        }

        const images = [];
        for (const file of req.files) {
            const s3Url = await uploadToS3(file);
            images.push(s3Url);
        }

        const projet = new Projet({ title, description, images, category, link });
        await projet.save();

        res.status(201).json(projet);
    } catch (error) {
        console.error("Erreur lors de la création du projet:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProjets = async (req, res) => {
    try {
        const projets = await Projet.find();
        res.json(projets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProjet = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, link } = req.body;
    
    try {

        if (!category || category.length === 0) {
            return res.status(400).json({ message: 'Une catégorie est requise.' });
        }

        const existingCategories = await Category.find({ _id: { $in: category } });
        if (existingCategories.length === 0) {
            return res.status(404).json({ message: 'Une ou plusieurs catégories non trouvées' });
        }

        const updateData = { title, description, category, link };

        if (req.files && req.files.length > 0) {
            const images = [];
            for (const file of req.files) {
                const s3Url = await uploadToS3(file);
                images.push(s3Url);
            }
            updateData.images = images;
        }

        const projet = await Projet.findByIdAndUpdate(id, updateData, { new: true });
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json(projet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProjet = async (req, res) => {
    const { id } = req.params;

    try {
        const projet = await Projet.findByIdAndDelete(id);
        if (!projet) {
            return res.status(404).json({ message: "Projet non trouvé." });
        }
        res.status(200).json({ message: "Projet supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
