const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const multer = require('../middleware/multer_config')

const stuffCtrl = require('../controllers/books');

//on ajoute auth sur toute les route pcq elles ont besoin d'être toutes authentifiées
router.get('/', stuffCtrl.getAllBooks); // j'ai retiré auth à tous les GET
router.post('/books', auth, multer, stuffCtrl.createBook);
//pourquoi Put au dessus de get ? lecture de bas en haut ? dans le cours "Ajoutons une autre route à notre application, juste en dessous de notre route GET individuelle."
router.get('/books/:id', stuffCtrl.getOneBook); 
router.get('/books/bestrating', stuffCtrl.getOneBook)
router.put('/books/:id', auth, multer, stuffCtrl.modifyBook); //modifier des objets
router.delete('/books/:id', auth, stuffCtrl.deleteBook);
router.post('/books/:id/rating', auth, stuffCtrl.modifyBook)

module.exports = router;