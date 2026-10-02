const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapasync = require('../utils/wrapAsycn.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userControllers=require("../controllers/user.js");
const { reviewSchema } = require('../schema.js');


// signup route 
router.route("/signup")
            .get( wrapasync(userControllers.rendersignupForm))
            .post(wrapasync(userControllers.signup));

// to  login page  and to login check user credentials
router.route("/login").
                    get(wrapasync( userControllers.renderLoginForm))
                    .post(
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    wrapasync(userControllers.login));

// logout 
router.get("/logout", wrapasync(userControllers.logout));

module.exports = router;