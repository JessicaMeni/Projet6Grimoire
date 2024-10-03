const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer_config')

const stuffCtrl = require('../controllers/stuff');

//on ajoute auth sur toute les route pcq elles ont besoin d'être toutes authentifiées
router.get('/', auth, stuffCtrl.getAllBooks);
router.post('/', auth, multer, stuffCtrl.createBook);
//pourquoi Put au dessus de get ? lecture de bas en haut ? dans le cours "Ajoutons une autre route à notre application, juste en dessous de notre route GET individuelle."
router.get('/:id', auth, stuffCtrl.getOneBook); 
router.put('/:id', auth, stuffCtrl.modifyBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);

module.exports = router;