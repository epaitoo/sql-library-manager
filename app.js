const express = require('express');

const app = express();
const sequelize = require('./models').sequelize;

app.set('view engine', 'pug');

app.use('/static', express.static('public'));

const mainRoute = require('./routes');
const booksRoute = require('./routes/books');

app.use(mainRoute);
app.use('/books', booksRoute);


app.use((req, res, next) => {
    const err = new Error("Not Found");
    console.log("Sorry, this page doesn't exist!");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('page-not-found', {title: 'Page Not Found'});
});


sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Application running on localhost:3000');
    }); 
})


