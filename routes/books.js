const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// List of all books
router.get('/', (req, res) => {
  Book.findAll().then((books) => {
    res.render('index', {books: books, title: 'Books' });
  }).catch((err) => {
    res.render('server-error', err, {title: 'Server Error'})
  });
});

// shows a new book form
router.get('/new', (req, res) => {
  res.render('new-book', { book: Book.build(), title: 'New Book' });
});

// creates a new book to the database
router.post('/new', (req, res) => {
  Book.create(req.body).then(() => {
    res.redirect('/');
  }).catch((err) => {
    res.render('server-error', err, {title: 'Server Error'})
  });
});

// Get individual book detail
router.get('/:id', (req, res) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      res.render('update-book', { book: book, title: 'Update Book' });
    } else {
      res.render('page-not-found', {title: 'Page Not Found'})
    } 
  }).catch((err) => {
    res.render('server-error', err, {title: 'Server Error'})
  });  
});

// updates the book detail 
router.post('/:id', (req, res) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body);
    } else {
      res.render('page-not-found', {title: 'Page Not Found'});
    } 
  }).then(() => {
    res.redirect('/');
  }).catch((err) => {
    res.render('server-error', err, { title: 'Server Error'})
  });
});



// deletes a book
// Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res) => {
  Book.findByPk(req.params.id).then((book) => {
    if (book) {
      return book.destroy();
    } else {
      res.render('page-not-found', {title: 'Page Not Found'});
    }  
  }).then(() =>{
    res.redirect('/');
  }).catch((err) => {
    res.render('server-error', err, {title: 'Server Error'})
  });
});



module.exports = router;