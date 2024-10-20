const express = require('express'); //importe express
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user'); 
const path = require('path');
const ENV = require("./env.json")

mongoose.connect(ENV.URL_BDD)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); //contient rien pour l'instant mais on appelle la méthode qui permet de créed une apli express

app.use(express.json());//intercepte tout content type json et nous met à disposition

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //d'envoyer des requêtes avec les méthodes mentionnées
    next();
});
//toute la logique des app use est importé grace au code en dessous
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes); // pourquoi pas api Connexion alors qu'on voit cette route en frontend ? "export const APP_ROUTES = {SIGN_IN: '/Connexion'
app.use('/api/book/:id/rating/', booksRoutes);// je dois créer une route best rating ?
app.use('/api/images/', express.static(path.join(__dirname, 'images')));

module.exports = app;