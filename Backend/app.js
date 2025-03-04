const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.DB_URL;
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.connect(`${dbUrl}`)
     .then(() => console.log('Connexion à MongoDB réussie !'))
     .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;