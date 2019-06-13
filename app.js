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

// error handlers
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {  message: err.message,  error: err  });
    });
}  


sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Application running on localhost:3000');
    }); 
})


