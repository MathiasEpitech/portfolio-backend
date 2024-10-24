const s3 = require('../config/awsConfig');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

async function uploadToS3(file) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        return imageUrl;
    } catch (err) {
        console.error("Erreur lors de l'upload à S3:", err);
        throw err;
    }
}

module.exports = {
    uploadToS3
};