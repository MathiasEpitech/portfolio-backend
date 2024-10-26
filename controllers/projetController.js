const Category = require('../models/Category');
const Projet = require('../models/Projet');
const { uploadToCloudinary } = require('../function/uploadImageFunction');
const cloudinary = require('../config/cloudinaryConfig')

exports.getProjets = async (req, res) => {
    try {
        const projets = await Projet.find();
        res.json(projets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProjet = async (req, res) => {
    
    const { title, description, category, technologies, link } = req.body;

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
        const existingImageNames = new Set(); 

        for (const file of req.files) {
            if (!existingImageNames.has(file.originalname)) {
                console.log("Téléchargement de l'image:", file.originalname);
                try {
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    images.push(cloudinaryUrl);
                    existingImageNames.add(file.originalname);
                } catch (error) {
                    console.error("Erreur lors de l'upload sur Cloudinary:", error);
                    return res.status(500).json({ message: 'Erreur lors de l\'upload des images.' });
                }
            } else {
                console.log(`Image déjà présente, non ajoutée: ${file.originalname}`);
            }
        }

        const projet = new Projet({ title, description, images, category, technologies, link });
        await projet.save();
        res.status(201).json(projet);
    } catch (error) {
        console.error("Erreur lors de la création du projet:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProjet = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, technologies, link } = req.body;

    try {
        console.log("Démarrage de la mise à jour du projet:", id);

        let images = [];

        if (req.files && req.files.length > 0) {
            console.log("Nouvelles images détectées");

            const existingProjet = await Projet.findById(id);
            if (!existingProjet) {
                console.log("Projet non trouvé:", id);
                return res.status(404).json({ message: 'Projet non trouvé' });
            }

            console.log("Ancien projet trouvé:", existingProjet);

            for (const imageUrl of existingProjet.images) {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                console.log("Suppression de l'image de Cloudinary:", publicId);
                await cloudinary.uploader.destroy(`portfolio_projects/${publicId}`);
            }

            for (const file of req.files) {
                console.log("Téléchargement de l'image sur Cloudinary:", file.originalname);
                const cloudinaryUrl = await uploadToCloudinary(file);
                images.push(cloudinaryUrl);
            }
        } else {
            console.log("Aucune nouvelle image à uploader");
        }

        if (!category || category.length === 0) {
            console.log("Aucune catégorie fournie");
            return res.status(400).json({ message: 'Une catégorie est requise.' });
        }

        const existingCategories = await Category.find({ _id: { $in: category } });
        if (existingCategories.length === 0) {
            console.log("Catégories non trouvées:", category);
            return res.status(404).json({ message: 'Une ou plusieurs catégories non trouvées' });
        }

        console.log("Catégories trouvées:", existingCategories);

        const updateData = { title, description, category, technologies, link };
        if (images.length > 0) {
            updateData.images = images;
            console.log("Images mises à jour:", images);
        }

        const projet = await Projet.findByIdAndUpdate(id, updateData, { new: true });
        if (!projet) {
            console.log("Projet non trouvé lors de la mise à jour:", id);
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        console.log("Projet mis à jour avec succès:", projet);
        res.json(projet);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du projet:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProjet = async (req, res) => {
    const { id } = req.params;

    try {
        const projet = await Projet.findById(id);
        if (!projet) {
            return res.status(404).json({ message: "Projet non trouvé." });
        }

        for (const imageUrl of projet.images) {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`portfolio/projects/${publicId}`);
        }

        await projet.deleteOne();

        res.status(200).json({ message: "Projet supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
        res.status(500).json({ message: error.message });
    }
};
