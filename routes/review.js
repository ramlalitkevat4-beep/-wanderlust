const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsycn.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const listing = require('../models/listing.js');

const validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));
     }
     next();
}


// Reviews  Post route
router.post('/',validateReview,wrapAsync(async(req,res)=>{
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

router.delete('/reviewId',wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params; // id is the listing id and reviewId is the review id
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
