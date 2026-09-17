// routes/listings.js
const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsycn.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const {isLoggedIn} =require('../middleware.js');
const{isOwner,validateListing,validateReview} =require('../middleware.js');




router.get('/', async (req, res) => {
    let alllistings = await listing.find({});
    res.render('listings/index.ejs',{alllistings});
    
});

// new Route
router.get('/new', isLoggedIn,(req, res) => {

    res.render('listings/new.ejs');
});



// Show route
router.get('/:id',wrapAsync( async (req, res) => {
     let {id} = req.params;
     const listing1=await listing.findById(id)
     .populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    
    if(!listing1){
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }
    
      res.render('listings/show.ejs',{listing: listing1});
}));
 
// Create new listing
router.post('/',isLoggedIn,validateListing, wrapAsync(async (req, res,next) => {
    const newlisting = new listing({ ...req.body.listing, owner: req.user._id });
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');

    
}));
router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
     let {id} = req.params;
    let listing1 =await listing.findById(id);
    
    await listing.findByIdAndUpdate( id,{ ...req.body.listing }, { new: true });
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
}))
 

// Delete Route 
router.delete('/:id',isLoggedIn,isOwner,async(req,res)=>{
let {id}=req.params;
let deletedlisting =await listing.findByIdAndDelete(id);
req.flash('success', 'Listing deleted successfully!');
console.log(deletedlisting);
res.redirect('/listings');
});



// Reviews  Post route
router.post('/:id/legacy-reviews',validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
let Listing=await listing.findById(req.params.id);
let newreview = new Review(req.body.review); 
 Listing.reviews.push(newreview);
 await newreview.save();
 await Listing.save();
 console.log('New review has been added');
 res.redirect(`/listings/${Listing._id}`);
}
));



module.exports = router;