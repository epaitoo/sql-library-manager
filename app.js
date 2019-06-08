const express = require('express');

const app = express();
const sequelize = require('./models').sequelize;

app.set('view engine', 'pug');

app.use('/static', express.static('public'));

const mainRoute = require('./routes');
const booksRoute = require('./routes/books');

app.use(mainRoute);
app.use('/books', booksRoute);


sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Application running on localhost:3000');
    }); 
})


