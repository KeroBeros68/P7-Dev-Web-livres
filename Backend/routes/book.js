const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImg = require('../middleware/sharp-config');

router.post('/', auth, multer, optimizeImg, bookCtrl.createBook);

router.post('/:id/rating', auth, bookCtrl.addBookRating);

router.put('/:id', auth);

router.delete('/:id', auth);

router.get('/bestrating', (req, res, next) => {

});

router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);

module.exports = router;