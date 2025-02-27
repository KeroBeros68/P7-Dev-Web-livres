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
        }
      ).catch(
        (error) => {
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
                console.log('fichier détruit!');
            };
          res.status(400).json({
            error: error
          });
        }
      );
};

exports.addBookRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
            .then( book => {
                if (!book) {
                    return res.status(404).json({ message: "Livre non trouvé" });
                }
                if (book.ratings.some(user => user.userId === req.auth.userId)) {
                    return res.status(400).json({ message: "Vous avez déjà noté ce livre."});
                }
                book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
                const totalRatings = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
                book.averageRating = totalRatings / book.ratings.length;
    
                book.save()
                    .then(() => res.status(200).json(book))
                    .catch(error => res.status(500).json({ message: "Erreur interne, réessayez plus tard." }));
            })
            .catch(error => res.status(500).json({ message: "Erreur serveur, réessayez plus tard."}));
};

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};