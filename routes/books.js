const express = require('express');
const router = express.Router();

// List of all books
router.get('/', (req, res) => {
  res.render('index');
});

// shows a new book form
router.get('/new', (req, res) => {
  res.render('new-book');
});

// post a new book to the database
router.post('/new', (req, res) => {

});

// Get individual book detail
router.get('/:id', (req, res) => {
  res.render('update-book');
});

// updates the book detail in the database
router.post('/:id', (req, res) => {

});



// deletes a book
// Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res) => {
  
});




module.exports = router;