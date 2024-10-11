const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


// Je modifie diskStorage pour memoryStorage, mais j'aurai eu les même résultats (passer les fichier en webp) sans changement ?
const storage = multer.diskStorage({ 
    destination:  (req, file, callback) => {
        callback(null, 'images') //stock img temporairement avant traitement dans temp
        fs.access("./images", (error) => {
            if (error) {
                fs.mkdirSync("./images");
            }
        });
    },
    filename: async (req, file, callback) => {
        
        const { buffer, originalname } = req.file;
        const timestamp = new Date().toISOString();
        const ref = `${timestamp}-${originalname.replace(/[\s.]+/g, '_')}.webp`;
        await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./images/" + ref);
    }
}); // on a généré un nom de fichier suffisamment unique pour notre utilisation

module.exports = multer({ storage }).single('image');