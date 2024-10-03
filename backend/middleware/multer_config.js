const multer = require('multer');

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') //dans quel fichier enregistrer les images, 2nd argument nom fichier
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.mimetype]; //comprends pas ?
        callback(null, name + Date.now() + '.' + extension);
    }
}); // on a généré un nom de fichier suffisamment unique pour notre utilisation

module.exports = multer({ storage }).single('image');