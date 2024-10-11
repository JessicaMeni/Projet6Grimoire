//logique métier dans le controleur
const Book = require ("../models/Book");
const sharp = require("sharp");
const fs = require('fs');
const path = require("path");

exports.createBook = (req, res, next) => {//POST au dessu de GET pour eviter les pb
    console.log('req.body:', req.body.book);
    console.log('req.file:', req.file);
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject, // copie les champs qui a dans le corps de la requête
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/api/images/${req.file.filename}`, // sans api/ ici ? ça ne fonctionne pas
        averageRating : bookObject.ratings[0].grade //recupère la 1 note en tant que moyenne
    }); //pour enregistrer ce book dans la base de donnée

/*     if (req.file) {
        const fichierImages = `images/${req.file.originalname.split('.')[0]}_${Date.now()}.webp`; // Chemin pour le fichier de sortie
        console.log("Buffer de l'image:", req.file.buffer);
        console.log("Taille du buffer:", req.file.size);

        sharp(req.file.buffer)
            .webp({ quality: 80 })
            .toFile(fichierImages, (err) => {
                if (err) {
                    console.error("Erreur lors de la conversion de l'image:", err);
                    console.log("Chemin du fichier:");
                    return res.status(500).json({ error: "Erreur lors de la conversion de l'image" });
                }
    
                book.imageUrl = `${req.protocol}://${req.get('host')}/api/images/${path.basename(fichierImages)}`;
                book.save()
                    .then(() => res.status(201).json({ message: 'image compressée enregistrée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
    } else { */

        book.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'})}) //si on fait pas ça, expiration de la requête
        .catch(error => {res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book)
    } : { ...req.body }; // si ce n'est pas le cas on récup l'objet le corps de la requête
    delete bookObject._userId;
    if (req.file) {
        const fichierImages = `images/${req.file.originalname.split(' ').join('_').split('.')[0]}_${Date.now()}.webp`; // Chemin pour le fichier de sortie

        sharp(req.file.buffer)
            .webp({ quality: 80 })
            .toFile(fichierImages, (err) => {
                if (err) {
                    console.error("Erreur lors de la conversion de l'image:", err);
                    return res.status(500).json({ error: err.message});
                }
                bookObject.imageUrl = `${req.protocol}://${req.get('host')}/api/images/${path.basename(fichierImages)}`;
                Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({message: 'image compressée modifiée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
    } else {
        Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id })
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
                res.status(403).json({message: '403: unauthorized request' });
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

exports.getAllBooks = (req, res, next, ) => { 
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.ratingBook = (req, res, next) => {
    const bookId = req.params.id;
    const userId = req.auth.userId;
    const userRating = req.body.rating;

    if (userRating < 1 || userRating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5.'})
    }// pourquoi _id et pas juste id ?
    Book.updateOne({ _id: bookId, 'ratings.userId':  { $ne: userId } },// Vérifie que l'utilisateur n'a pas encore noté. updateOne de Mongoose
        { $push: { ratings: { userId: userId, rating: userRating } } } // Ajouter la nouvelle note au tableau des ratings
    )
    .then(result => {
        if (result.nModified === 0) { //si pas de modification: l'utilisateur a déjà noté l'objet
            return res.status(403).json({ error })
        } 
        res.status(200).json({ message: 'La note a été ajoutée.'})
    })
    .catch(error => res.status(500).json({ error }));
};

exports.bestRatedBooks = (req, res, next) => {
    const bookObject = JSON.parse(req.body.Book);
    Book.find().sort({averageRating : bookObject.rating}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};