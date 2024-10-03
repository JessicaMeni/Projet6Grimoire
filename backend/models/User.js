const mongoose = require('mongoose');
//j'ai du désinstaller et installer mongoose@^7.0.0 au lieu de "mongoose-unique-validator --force" c ok ?
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //pour eviter l'inscription avec le même mail
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);