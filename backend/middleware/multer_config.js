const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({ 
    destination:  (req, file, callback) => {
        fs.access("./images", (error) => {
            if (error) {
                fs.mkdirSync("./images");
            }
        });
        callback(null, 'images')
    },
    filename: async (req, file, callback) => {
        let name = file.originalname.split(' ').join('_');
        name = name.split(".").slice(0, -1).join("_");
        callback(null, name + Date.now());
    }// on a généré un nom de fichier suffisamment unique pour notre utilisation
}); 

module.exports = multer({ storage }).single('image');