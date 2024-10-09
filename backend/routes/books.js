const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const multer = require('../middleware/multer_config')

const stuffCtrl = require('../controllers/books');

//on ajoute auth sur toute les route pcq elles ont besoin d'être toutes authentifiées
router.get('/', stuffCtrl.getAllBooks); // j'ai retiré auth à tous les GET, fonctionne quand j'ai retiré /book/, pq ?
router.post('/', auth, multer, stuffCtrl.createBook);
//pourquoi Put au dessus de get ? lecture de bas en haut ? dans le cours "Ajoutons une autre route à notre application, juste en dessous de notre route GET individuelle."
router.get('/:id', stuffCtrl.getOneBook); 
router.get('/bestrating', stuffCtrl.getAllBooks) //a modifier
router.put('/:id', auth, multer, stuffCtrl.modifyBook); //modifier des objets
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.post('/:id/rating', auth, stuffCtrl.modifyBook) // a modif je suppose

module.exports = router;