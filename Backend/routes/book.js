const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');

router.post('/', auth, bookCtrl.createBook);

router.post('/:id/rating', (req, res, next) => {
});

router.put('/:id', (req, res, next) => {

});

router.delete('/:id', (req, res, next) => {

});

router.get('/:id', (req, res, next) => {

});

router.get('/bestrating', (req, res, next) => {

});

router.get('/', (req, res, next) => {

});

module.exports = router;