const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapasync=require('../utils/wrapAsycn.js');
const passport = require('passport');




router.get('/signup',(req,res)=>{
   
    res.render('users/signup.ejs');
});

router.post('/signup',wrapasync(async(req,res)=>{
   try{
    console.log(req.body);
    let{username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    
    console.log(registeredUser);
    req.flash('success','Welcome to Wanderlust');
    res.redirect('/listings');
   }catch(e){
    req.flash('error',e.message);
    res.redirect('/signup');
   }
   
}));

// to  login page
router.get('/login',(req,res)=>{
    
    res.render('users/login.ejs');
});


// to login check user credentials
router.post('/login',
    passport.authenticate('local', {
     failureRedirect: '/login', 
     failureFlash: true }),
     wrapasync(async(req,res)=>{  
    //passport middleware to check user credentials
    try{
        const {username,password}=req.body;
        req.flash('success','Logged in successfully');
        res.redirect('/listings');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/login');
    }
}
));

module.exports=router;