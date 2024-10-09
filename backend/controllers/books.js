//logique métier dans le controleur
const Book = require ("../models/Book");
const fs = require('fs');

exports.createBook = (req, res, next) => {//mettre post au dessu de GET pour eviter les pb
    console.log('req.body:', req.body.book);
    console.log('req.file:', req.file);
    const bookObject = JSON.parse(req.body.book); // j'ai remplacé thing par book ... 
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject, // copie les champs qui a dans le corps de la requête
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/api/images/${req.file.filename}` //pour correspondre à la route app.use, j'ai ajouté api/images
    }); //pour enregistrer ce book dans la base de donnée
    book.save() //
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})}) //si on fait pas ça, expiration de la requête
    .catch(error => {res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/api/images/${req.file.filename}`
    } : { ...req.body }; // si ce n'est pas le cas on récup l'objet le corps de la requête
    
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorisé' });
            } else {
                Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la modif du livre', error);
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if  (book.userId != req.auth.userId){
                res.status(401).json({message: 'Non autorisé' });
                } else {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                    });
                }

        })
        .catch( error => {
            console.error('Erreur lors de la recherche du livre', error);
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res, next) => { //uniquement les requetes GET qu'on intercepte
    req.params.id
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => { 
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};