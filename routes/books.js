const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const bodyParser = require('body-parser');
const Sequelize = require('../models').Sequelize;
const Op = Sequelize.Op;

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())



// List of all books with pagination
router.get('/', (req, res) => {

  const limit = 10
  let pageNum = req.query.page; 
  let offset;
  let pages;  //Number of pages

    if (pageNum === undefined || pageNum <= 1) {
        pageNum = 1;
    } else {
        pageNum = limit * (pageNum - 1);
    }
  
  
  offset = pageNum; 
  // total numbber of books
  Book.count()
    .then((count) => {
      pages = Math.ceil( count / limit);
  })
  
  // findAll books with limit of 10 books per page
  Book.findAll({ offset, limit, order: [['title', 'ASC']] })
    .then((books) => {
      res.render('index', { books: books, title: 'Books', isSearch: false, pages, pageNum: req.query.page});
      
  }).catch((err) => {
      res.render('error', err)
  });    

});





// Search for a book 
router.get('/search', (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();

  Book.findAll({ where: { 
      [Op.or] : [
        { title : { [Op.like]: '%' + term + '%'  } },
        { author : { [Op.like]: '%' + term + '%'  } },
        { genre : { [Op.like]: '%' + term + '%'  } },
        { year : { [Op.like]: '%' + term + '%'  } }
      ] 
    }
  })
    .then((books) => {
      res.render('index', {books: books, title: 'Books', isSearch: true } );
  }).catch(err => console.log(err))

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
    if (err.name === "SequelizeValidationError") {
      res.render('new-book', { 
        book: Book.build(req.body), 
        title: 'New Book',
        errors: err.errors 
      });
    } else {
      throw err;
    }
  }).catch((err) => {
    res.render('error', err)
  });
});





// Get individual book detail
router.get('/:id', (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book) {
        res.render('update-book', { book: book, title: 'Update Book' });
      } else {
        res.render('page-not-found', {title: 'Page Not Found'})
      } 
  }).catch((err) => {
    res.render('error', err)
  });  
});




// updates the book detail 
router.post('/:id', (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book) {
        return book.update(req.body);
      } else {
        res.render('page-not-found', {title: 'Page Not Found'});
      } 
  }).then(() => {
    res.redirect('/');
  }).catch((err) => {
    if (err.name === "SequelizeValidationError") {
      const book = Book.build(req.body);
      book.id = req.params.id;
        res.render('update-book', { 
          book: book, 
          title: 'Update Book',
          errors: err.errors 
        });
    } else {
      throw err;
    }
  }).catch((err) => {
    res.render('error', err)
  });
});





// deletes a book
// Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting.
router.post('/:id/delete', (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (book) {
        return book.destroy();
      } else {
        res.render('page-not-found', {title: 'Page Not Found'});
      }  
  }).then(() =>{
    res.redirect('/');
  }).catch((err) => {
    res.render('error', err)
  });
});


module.exports = router;