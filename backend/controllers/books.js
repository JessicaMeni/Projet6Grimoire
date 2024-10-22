//logique métier dans le controleur
const Book = require ("../models/Book");
const sharp = require("sharp");
const fs = require('fs');

exports.createBook = (req, res, next) => {//POST au dessu de GET pour eviter les pb
    console.log('req.body:', req.body.book);
    console.log('req.file:', req.file);
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject, // copie les champs qui a dans le corps de la requête
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/api/images/${req.file.filename}`,
        averageRating : bookObject.ratings[0].grade //recupère la 1 note en tant que moyenne
    }); //pour enregistrer ce book dans la base de donnée

    book.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
        .catch(error => {res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book)
    } : { ...req.body }; // si ce n'est pas le cas on récup l'objet le corps de la requête
    delete bookObject._userId;

    Book.findOne({ _id: req.params.id})
        .then((book) => {
            if (!book) {
                res.status(404);
            } else if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'Non-autorisé' });
            } else {
                if (req.file) {
                    bookObject.imageUrl = `${req.protocol}://${req.get('host')}/api/images/${req.file.filename}`;
                }
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

exports.getOneBook = (req, res, next) => {
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
    const userId = req.auth.userId;
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if (!book) {
            return res.status(404).json({ error: "Objet non trouvé." });
        }
        
        const existingRating = book.ratings.find((rating) => rating.userId === userId);
        if (existingRating) {
            existingRating.grade = req.body.grade;
            delete modRatingBook._id;
            
            const ratingsNumber = book.ratings.length // pour calculer la moyenne, nbr de notes
            let totalRatings = 0;
            book.ratings.forEach(r => {
                totalRatings += r.grade
            });
            const averageRating = Math.round(totalRatings / ratingsNumber); //On récupère la moyenne en arrondissant le total divisé par le nombre de notes
            book.averageRating = averageRating;
            book.save()
            .then((book) => res.status(200).json(book))
            .catch(error => res.status(500).json({ error }));

        } else if (req.body.rating >= 1 && req.body.rating <= 5) {
            const RatingBook = {
                ...req.body,
                grade: req.body.rating,
            };
            delete RatingBook._id;
            book.ratings.push(RatingBook);
            const ratingsNumber = book.ratings.length // pour calculer la moyenne, nbr de notes
            let totalRatings = 0;
            book.ratings.forEach(r => {
                totalRatings += r.grade
            });
            const averageRating = Math.round(totalRatings / ratingsNumber); //On récupère la moyenne en arrondissant le total divisé par le nombre de notes
            book.averageRating = averageRating;
            book.save()
                .then(() => res.status(200).json(book))
                .catch(error => res.status(500).json({ error }));
        } else {
            res.status(400).json({ error: "La note doit être comprise entre 1 et 5." });
        }
    })
    .catch((error) => res.status(500).json({ error}));
};

exports.bestRatedBooks = (req, res, next) => {
    Book.find().sort({averageRating : -1}).limit(3) //tri des livres par rapport aux moyenne dans l'ordre décroissant
    
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
};