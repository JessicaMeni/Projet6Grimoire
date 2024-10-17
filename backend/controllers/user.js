const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //fonction de hachage de bcrypt dans notre mdp et lui demandons de «saler» le mdp 10 fois.
    .then(hash => {
        const user = new User( {
            email: req.body.email, // créons un utilisateur et l'enregistrer
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({ error }));
        console.log('error');
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
     User.findOne({email: req.body.email})
     .then(user => {
        if (user === null) {
            res.status(401).json({message: 'Paire indentifiant/mdp incorrect'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Paire indentifiant/mdp incorrect'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //sign pour chiffrer un nouveau token
                            { userId: user._id },
                            'RAMDOM_TOKEN_SECRET', // pourquoi c'est à nous de créer un ramdom token et pas bcrypt
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => { res.status(500).json({ error });
            })
        }
     })
     .catch(error => { res.status(500).json({ error });
     });
};