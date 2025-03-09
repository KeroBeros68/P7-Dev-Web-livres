const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const cryptoJS = require('crypto-js');
require('dotenv').config();

const secretKey = cryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);
const secretIv = cryptoJS.enc.Utf8.parse(process.env.SECRET_IV);

const userSchema = mongoose.Schema({
    email : { 
        type: String,
        required: true,
        unique: true,
        set: (email) => cryptoJS.AES.encrypt(email, secretKey, { iv: secretIv }).toString(),
        get: (encrypted) => cryptoJS.AES.decrypt(encrypted, secretKey, { iv: secretIv }).toString(cryptoJS.enc.Utf8)
    }, //- adresse e-mail de l’utilisateur [unique]
    password : { type: String, required: true } //- mot de passe haché de l’utilisateur
    
}, { toJSON: { getters: true } });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);