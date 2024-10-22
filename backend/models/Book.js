const mongoose = require('mongoose');

const Book = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: { type: [ { 
        userId: { type: String, required: true, }, 
        grade: { type: Number, required: true, min: 0, max: 5, }, 
        }, ],
    required: true,
    },
    averageRating: { type: Number, required: true },
});
//exportons ce schéma en tant que modele Mongoose appelé Book
module.exports = mongoose.model('Book', Book) 

