const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapasync = require('../utils/wrapAsycn.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');




router.get('/signup', (req, res) => {

    res.render('users/signup.ejs');
});

router.post('/signup', wrapasync(async (req, res, next) => {
    try {
        console.log(req.body);
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => { //after signup direct login 
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }

}));

// to  login page
router.get('/login', (req, res) => {

    res.render('users/login.ejs');
});


// to login check user credentials
router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    wrapasync(async (req, res) => {
        req.flash('success', 'Logged in successfully');
        const redirectUrl = req.session.redirectUrl || '/listings';
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    }
    ));

// logout 
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out now ");
        res.redirect("/listings")
    })
});

module.exports = router;