const User = require('../models/user.js');

module.exports.rendersignupForm = (req, res) => {
    return res.render('users/signup.ejs');
};

module.exports.renderLoginForm = (req, res) => {
    return res.render('users/login.ejs');
};

module.exports.signup = async (req, res, next) => {
    try {
        console.log(req.body);
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        return req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            return res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/signup');
    }
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Logged in successfully');
    const redirectUrl = req.session.redirectUrl || '/listings';
    delete req.session.redirectUrl;
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out now ");
        return res.redirect("/listings");
    });
};
