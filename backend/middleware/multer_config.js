const multer = require('multer');
const sharp = require('sharp');

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Je modifie diskStorage pour memoryStorage, mais j'aurai eu les même résultats (passer les fichier en webp) sans changement ?
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, 'images') //stock img temporairement avant traitement dans temp
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
}); // on a généré un nom de fichier suffisamment unique pour notre utilisation

module.exports = multer({ storage }).single('image');

