const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('./config/logger');
const santizeReq = require('./middleware/sanitize');
require('dotenv').config({ path: './config/.env' });

const dbUrl = process.env.DB_URL;
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.connect(`${dbUrl}`)
     .then(() => logger.info('Connexion à MongoDB réussie !'))
     .catch(() => logger.error('Connexion à MongoDB échouée !'));

const app = express();

const morganStream = {
  write: (message) => logger.info(message.trim())
};

app.use(morgan('combined', { stream: morganStream }));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
app.use(santizeReq);
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;