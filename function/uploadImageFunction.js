const cloudinary = require('../config/cloudinaryConfig');

async function uploadToCloudinary(file) {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'portfolio/projects'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Erreur lors de l\'upload à Cloudinary:', error);
        throw error;
    }
}

module.exports = { uploadToCloudinary };