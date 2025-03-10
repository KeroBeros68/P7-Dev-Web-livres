const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 60*1000,
    max: 3,
    message: { message: "Trop de tentatives de connexion. Réessayez plus tard."},
    headers: true
});