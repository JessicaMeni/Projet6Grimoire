const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //pour eviter l'inscription avec le même mail
    password: { type: String, required: true }
});

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User);