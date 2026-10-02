require('dotenv').config();

const express = require('express');
const app = express();
app.locals.mapToken = process.env.MAP_TOKEN || 'REPLACE_WITH_MAPBOX_TOKEN';
const mongoose = require('mongoose');
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter=require('./routes/listings.js')
const reviewRouter=require('./routes/review.js')
const userRouter=require('./routes/user.js')
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash=require('./utils/flash.js');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const dbUrl = process.env.ATLASDB_URL;

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

async function main() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log("Connected to Atlas MongoDB");
    } catch (err) {
        console.error("Atlas MongoDB connection failed:", err);
        process.exit(1);
    }
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", (e) => {
    console.log("Mongo Session store error", e);
});

const sessionOptions={
    store:store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};



app.use(session(sessionOptions)); // to use session as middleware
app.use(flash()); // to use flash as middleware

app.use(passport.initialize()); // assport ko Express application me initialize karta hai.
app.use(passport.session()); //ne logged-in user ko session ke through remember karne ke liye
passport.use(new LocalStrategy(User.authenticate())); // to use local strategy for authentication
passport.serializeUser(User.serializeUser()); // to serialize user for session
passport.deserializeUser(User.deserializeUser()); // to deserialize user for session



// middleware to set flash messages in response locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user;
    next();
});





// routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
    res.redirect('/listings');
});

// middleware to handle 404 errors
app.all("/*splat",(req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});


// middleware to handle errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
   res.status(statusCode).render('listings/Error', { err });
});

main()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });