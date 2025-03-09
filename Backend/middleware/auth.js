const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${secretKey}`);
        const userId = decodedToken.userId;

        req.auth = {
            userId: userId
        };
    next();
    } catch(error) {
        logger.error(error);
        res.status(401).json({ error });
    }
};