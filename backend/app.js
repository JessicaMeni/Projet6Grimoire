const express = require('express'); //importe express
const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://rfezxfsbj:bI6eBOcg4tEmQq88@cluster0.p81jn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log(error));
/* .catch(() => console.log('Connexion à MongoDB échouée !')); */

const app = express(); //contient rien pour l'instant mais on appelle la méthode qui permet de créed une apli express

app.use(express.json());//intercepte tout content type json et nous met a disposition

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //d'envoyer des requêtes avec les méthodes mentionnées
    next();
});
//toute la logique des app use est importé grace au code en dessous
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;