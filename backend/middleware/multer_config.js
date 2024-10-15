const multer = require('multer');
const fs = require('fs');

// Je modifie diskStorage pour memoryStorage, mais j'aurai eu les même résultats (passer les fichier en webp) sans changement ?
const storage = multer.diskStorage({ 
    destination:  (req, file, callback) => {
        fs.access("./images", (error) => {
            if (error) {
                fs.mkdirSync("./images");
            }
        });
        callback(null, 'images') //stock img temporairement avant traitement dans temp
    },
    filename: async (req, file, callback) => {
        let name = file.originalname.split(' ').join('_');
        name = name.split(".").slice(0, -1).join("_");
        callback(null, name + Date.now());
    }// on a généré un nom de fichier suffisamment unique pour notre utilisation
}); 

module.exports = multer({ storage }).single('image');