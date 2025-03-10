const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('../middleware/login-limiter');

router.post('/signup', userCtrl.signUp);
router.post('/login', rateLimit, userCtrl.login);

module.exports = router;