const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash=require('connect-flash');   
const sessionOptions = {secret: 'mysupersecret',resave:false, saveUninitialized: false,
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session(sessionOptions));  // as medileware to use session
app.use(flash());  // as medileware to use flash messages

app.get('/register', (req, res) => {
    let {name=anonymous} = req.query;
    req.session.name = name;  // store the name in session

    console.log(req.session);
    req.flash('success', 'You have successfully registered!');  // store a flash message key and msg
    res.send(`Register Page - Welcome, ${name}!`);

});

app.get('/hello', (req, res) => {
      
   res.render('page.ejs', {name: req.session.name, message: req.flash('success')});  // retrieve the flash message
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
)