//logique métier dans le controleur
const Book = require ("../models/Book");

exports.createBook = (req, res, next) => { //Pourquoi lui est la le createBook en dessous
    const bookObject = JSON.parse(req.body.book); //ERREUR POUR CETTE LIGNE
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => {res.status(400).json( { error })})
};

exports.createBook = (req, res, next) => { //mettre post au dessu de GET pour eviter les pb
    //le frontend vu sa construction,va générer un ID par MangoDB, donc on le retire
    delete req.body._id; // a disparu dans le chap 3 du cours, donc on le supprime ?
    const book = new Book({
        /* title: req.body.title, */
        ...req.body // copie les champs qui a dans le corps de la requête
    });
    //pour enregistrer ce book dans la base de donnée
    book.save() //les autres (deleteBook modifyBook et getBook) sont avec un B maj et pas celui la?
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //si on fait pas ça, expiration de la requête
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Obj modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
    .catch(error => res.status(400).json({ error }));
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