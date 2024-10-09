//logique métier dans le controleur
const sharp = require("sharp");
const Book = require ("../models/Book");
const fs = require('fs');
const path = require("path");

exports.createBook = (req, res, next) => {//mettre post au dessu de GET pour eviter les pb
    console.log('req.body:', req.body.book);
    console.log('req.file:', req.file);
    const bookObject = JSON.parse(req.body.book); // j'ai remplacé thing par book ... 
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject, // copie les champs qui a dans le corps de la requête
        userId: req.auth.userId,
    }); //pour enregistrer ce book dans la base de donnée
    if (req.file) {
        const tempPath = req.file.path; //chemin temp de l'image téléchargée
        const fichierImages = `images/${req.file.filename.split('.')[0]}.webp`;

        sharp(tempPath)
            .webp({ quality: 80 })
            .toFile(fichierImages, (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message});
                }
                fs.unlinkSync(tempPath); // Supprimer l'image temporaire
                book.imageUrl = `${req.protocol}://${req.get('host')}/api/images/${path.basename(fichierImages)}`; //pour correspondre à la route app.use, j'ai ajouté api/images
                book.save()
                    .then(() => res.status(201).json({ message: 'image compressée enregistrée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
    } else {
    book.save()
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})}) //si on fait pas ça, expiration de la requête
    .catch(error => {res.status(400).json( { error })})
}};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book)
    } : { ...req.body }; // si ce n'est pas le cas on récup l'objet le corps de la requête
    if (req.file) {
        const tempPath = req.file.path; //chemin temp de l'image téléchargée
        const fichierImages = `images/${req.file.filename.split('.')[0]}.webp`;

        sharp(tempPath)
            .webp({ quality: 80 })
            .toFile(fichierImages, (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message});
                }
                fs.unlinkSync(tempPath); // Supprimer l'image temporaire

                bookObject.imageUrl = `${req.protocol}://${req.get('host')}/api/images/${path.basename(fichierImages)}`;
                Book.updateOne({ _id: req.params.id, userId: req.auth.userId }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({message: 'image compressée modifiée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
    } else {
        Book.updateOne({ _id: req.params.id, userId: req.auth.userId }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
    }
    
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