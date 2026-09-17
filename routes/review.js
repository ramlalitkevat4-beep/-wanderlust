const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsycn.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')



// Reviews  Post route
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {

    const Listing = await listing.findById(req.params.id);

    const newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    console.log("NEW REVIEW:", newReview);
    

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();

    console.log("✅ New review has been added");

    res.redirect(`/listings/${Listing._id}`);
}));

// Delete Review Route

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params; // id is the listing id and reviewId is the review id
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
