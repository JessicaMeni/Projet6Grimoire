const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const sharp = require('sharp');

const multer = require('../middleware/multer_config')
const resizeImage = require('../middleware/sharp_config')

const booksCtrl = require('../controllers/books');

//on ajoute auth sur toute les route pcq elles ont besoin d'être toutes authentifiées
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.bestRatedBooks)
router.get('/:id', booksCtrl.getOneBook); 
router.post('/', auth, multer, resizeImage, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook)
router.put('/:id', auth, multer, resizeImage, booksCtrl.modifyBook); //modifier des objets
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;