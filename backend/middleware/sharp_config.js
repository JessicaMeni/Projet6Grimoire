const path = require('path');
const sharp = require('sharp');
const fs = require('fs');


const resizeImage = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }

    const webpFileName = `${req.file.filename}.webp`; //ajout de cette ligne pour que ça fonctionne
    const nouveauPath = path.join(".", "images", req.file.filename + ".webp");

    await sharp(req.file.path)
        .resize(600, 600, { fit: 'inside' })
        .webp({ quality: 70 })
        .toFile(nouveauPath);

    req.file.filename = webpFileName; //ajout de cette ligne pour que ça fonctionne
    req.file.path = nouveauPath;

    next();
};

module.exports = resizeImage;