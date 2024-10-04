const mongoose = require('mongoose');

const Book = mongoose.Schema({ //c'est ok Book avec B maj ?
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});
//exportons ce schéma en tant que modele Mongoose appelé Book
module.exports = mongoose.model('Book', Book) 