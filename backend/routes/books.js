const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const multer = require('../middleware/multer_config')

const booksCtrl = require('../controllers/books');

//on ajoute auth sur toute les route pcq elles ont besoin d'être toutes authentifiées
router.get('/', booksCtrl.getAllBooks); // j'ai retiré auth à tous les GET, fonctionne quand j'ai retiré /book/, pq ?
router.get('/bestrating', booksCtrl.bestRatedBooks)
router.get('/:id', booksCtrl.getOneBook); 
router.post('/', auth, multer, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook) // Définit la note pour le user ID fourni. La note entre 0 et 5. L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" afin de ne pas laisser un utilisateur noter deux fois le même livre.
router.put('/:id', auth, multer, booksCtrl.modifyBook); //modifier des objets
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;