const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings=require('./routes/listings.js')
const reviews=require('./routes/review.js')

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(url);
}


app.get('/', (req, res) => {
    res.send('hello world');
});




app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews)


app.all("/{*splat}",(req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
   res.status(statusCode).render('listings/Error', { err });
});


main().then(() => {
    console.log('connected to database');
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}).catch((err) => {
    console.log('error connecting to database', err);
});