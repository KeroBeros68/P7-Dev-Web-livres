const sharp = require('sharp');
const fs = require('fs');

const optimizeImg = async (req, res, next) => {
    if (!req.file) return next();

    const filePath = req.file.path;
    const newName = `optimized-${Date.now()}.webp`
    const newFilePath = `images/${newName}`;
    try {
        await sharp(filePath)
            .resize(400, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
            .toFormat('webp')
            .webp({ quality: 80 })
            .toFile(newFilePath);

        fs.unlinkSync(filePath);
        req.file.path = newFilePath;
        req.file.filename = newName;
        next(); 
    } catch (error) {
        if (filePath) {
            fs.unlinkSync(filePath);
        }
        console.error('Erreur lors de l’optimisation de l’image:', error);
        return res.status(500).json({ error: 'Erreur lors du traitement de l’image' });
    }
};

module.exports = optimizeImg;