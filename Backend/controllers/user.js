const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => {
                    logger.info(`User saved`);
                    res.status(201).json({ message: 'User saved!!'});
                })
                .catch(error => {
                    logger.error(error);
                    res.status(400).json({ error });
                });
        })
        .catch(error => {
            logger.error(error);
            res.status(500).json({ error });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            console.log(req.body.email)
            if (!user){
                logger.warn(`Connection denied`);
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            };
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        logger.warn(`Connection denied`);
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                    };
                    logger.info(`User ${user._id} connected`)
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${secretKey}`,
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => {
                    logger.error(error);
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            logger.error(error);
            res.status(500).json({ error });
        });
};