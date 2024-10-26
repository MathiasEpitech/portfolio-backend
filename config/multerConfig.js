const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/projects',
        allowed_formats: ['jpg', 'png', 'jpeg'],

        // public_id: (req, file) => file.originalname.split('.')[0], // Pour utiliser le nom original sans l'extension
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
