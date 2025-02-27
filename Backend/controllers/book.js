const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
    const book = new Book({
        title : req.body.title,
        author : req.body.author,
        imageUrl : req.body.author,
        year: req.body.year,
        genre: req.body.genre,
        userId: req.body.userId
    });
    book.save().then(
        () => {
          res.status(201).json({
            message: 'Book saved successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
}