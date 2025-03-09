const logger = require('../logger');
const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: bookObject.ratings.map((rating, index) =>
            index === 0 ? { ...rating, userId: req.auth.userId } : rating
        ),
    });
    book.save().then(
        () => {
          res.status(201).json({
            message: 'Book saved successfully!'
          });
          logger.info(`Book created by ${req.auth.userId}`)
        }
      ).catch(
        (error) => {
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
                logger.info('The temporary file has been deleted!');
            };
          res.status(400).json({
            error: error
          });
          logger.error(error);
        }
      );
};

exports.addBookRating = (req, res, next) => {
    const userId = req.auth.userId;
    const rating = req.body.rating;

    Book.findOne({ _id: req.params.id })
            .then( book => {
                if (!book) {
                    logger.info(`Book unknown : ${req.params.id}`);
                    return res.status(404).json({ message: "Livre non trouvé" });
                }
                if (book.ratings.some(user => user.userId === userId)) {
                    logger.info(`Book ${req.params.id} already rated by ${userId}`);
                    return res.status(400).json({ message: "Vous avez déjà noté ce livre."});
                }
                Book.findOneAndUpdate(
                    { _id: req.params.id },
                    { 
                        $push: { ratings: { userId: userId, grade: rating } },
                        $set: { averageRating: ((book.averageRating * book.ratings.length + rating) / (book.ratings.length + 1)).toFixed(2) }
                    },
                    { new: true }
                )
                    .then(updatedBook => {
                        logger.info(`Book ${book._id} updated by ${req.auth.userId}`);
                        res.status(200).json(updatedBook);
                    })
                    .catch(error => {
                        logger.error(error);
                        res.status(500).json({ message: "Erreur interne, réessayez plus tard." });
                    });
            })
            .catch(error => {
                logger.error(error);
                res.status(500).json({ message: "Erreur interne, réessayez plus tard." });
            });
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    
    } : { ...req.body };

    delete bookObject._userId;

    Book.findOne({ _id: req.params.id})
        .then ((book) => {
            if (book.userId != req.auth.userId) {
                logger.warn(`User ${req.auth.userId} unauthorized for book ${book._id}`);
                return res.status(401).json({ message: 'Not authorized'});
            } else {
                const oldImageUrl = book.imageUrl
                const filename = oldImageUrl.split('/images/')[1];
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => {
                        if (!bookObject.imageUrl) { 
                            logger.info(`User ${req.auth.userId} modify book ${book._id}`);
                            return res.status(200).json({message: 'Livre modifié!'});
                        }
                        fs.unlink(`images/${filename}`, (err) => { if (err) throw err});
                        logger.info(`User ${req.auth.userId} modify book ${book._id}`);
                        res.status(200).json({message: 'Livre modifié!'})
                    })
                    .catch(error => {
                        logger.error(error);
                        res.status(401).json({ error });
                    });
            }
        })
        .catch((error) => {
            logger.error(error);
            res.status(400).json({ error });
        });
};

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                logger.warn(`User ${req.auth.userId} unauthorized for book ${book._id}`);
                return res.status(401).json({message: 'Not authorized'});
            } else {
                Book.deleteOne({ _id: req.params.id })
                    .then(() => {
                        const filename = book.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, (err) => { if (err) throw err});
                        logger.error(`Book ${book._id} deleted by ${req.auth.userId}`);
                        res.status(200).json({ message: 'Objet supprimé !'});
                    })
                    .catch(error => {
                        logger.error(error);
                        res.status(400).json({ error });
                    })
            }
        })
        .catch( error => {
            logger.error(error);
            res.status(500).json({ error });
        });
};

exports.getBestRating = async (req, res, next) => {
    try {
        const topBooks = await Book.find()
            .sort({ averageRating: -1 })
            .limit(3);

        res.status(200).json(topBooks);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Erreur serveur"});
    }
};

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => {
            logger.error(error);
            res.status(400).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => {
            logger.error(error);
            res.status(400).json({ error });
        });
};