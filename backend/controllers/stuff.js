//logique métier dans le controleur
const Book = require ("../models/Book");
const fs = require('fs');

exports.createBook = (req, res, next) => {//mettre post au dessu de GET pour eviter les pb
    console.log('req.body:', req.body.objet);
    console.log('req.file:', req.file);
    const bookObject = JSON.parse(req.body.objet); //ERREUR POUR CETTE LIGNE Book ne fonctionne pas mais objet oui, pq??
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject, // copie les champs qui a dans le corps de la requête
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }); //pour enregistrer ce book dans la base de donnée
    book.save() //les autres (deleteBook modifyBook et getBook) sont avec un B maj et pas celui la?
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})}) //si on fait pas ça, expiration de la requête
    .catch(error => {res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.objet),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // si ce n'est pas le cas on récup l'objet le corps de la requête
    
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id})
        .then((book) => { //ou objet ?
            if (book.userId != req.auth.userId) { //ou thing ?
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
/* Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) */


exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if  (book.userId != req.auth.userId){
                res.status(401).json({message: 'Non autorisé' });
                } else {
                    const filename = Book.imageUrl.split('/images/')[1];
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
    req.params.id //Book c'est pour la const Book du book.js ?
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => { 
    Book.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};