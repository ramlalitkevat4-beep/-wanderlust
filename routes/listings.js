// routes/listings.js
const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsycn.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');

const validateListing = (req, res, next) => {
     let { error } = listingSchema.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));
     }
     next();
}


const validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));
     }
     next();
}


router.get('/', async (req, res) => {
    let alllistings = await listing.find({});
    res.render('listings/index.ejs',{alllistings});
    
});

// new Route
router.get('/new', (req, res) => {

    res.render('listings/new.ejs');
});



// Show route
router.get('/:id',wrapAsync( async (req, res) => {
     let {id} = req.params;
     const listing1=await listing.findById(id).populate("reviews");
    
    if(!listing1){
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }
      res.render('listings/show.ejs',{listing: listing1});
}));

// Create new listing
router.post('/',validateListing, wrapAsync(async (req, res,next) => {
    const newlisting = new listing(req.body.listing);
   
    await newlisting.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');

    
}));


// edit route
router.get('/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing1=await listing.findById(id);
    req.flash('success', 'Listing fetched for editing successfully!');
    res.render('listings/edit.ejs',{listing: listing1});
});

// updates  listing
router.put('/:id',validateListing,wrapAsync(async(req,res)=>{
     let {id} = req.params;
    
    await listing.findByIdAndUpdate( id,{ ...req.body.listing }, { new: true });
    req.flash('success', 'Listing updated successfully!');
    res.redirect('/listings');
}))
 

// Delete Route 
router.delete('/:id',async(req,res)=>{
let {id}=req.params;
let deletedlisting =await listing.findByIdAndDelete(id);
req.flash('success', 'Listing deleted successfully!');
console.log(deletedlisting);
res.redirect('/listings');
});



// Reviews  Post route
router.post('/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
let Listing=await listing.findById(req.params.id);
let newreview = new Review(req.body.review); 
 Listing.reviews.push(newreview);
 await newreview.save();
 await Listing.save();
 console.log('New review has been added');
 res.redirect(`/listings/${Listing._id}`);
}
));



// Delete Review Route

router.delete('/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params; // id is the listing id and reviewId is the review id
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;