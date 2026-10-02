const listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
    const Listing = await listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    console.log("NEW REVIEW:", newReview);

    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();

    console.log("✅ New review has been added");

    return res.redirect(`/listings/${Listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params; // id is the listing id and reviewId is the review id
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    return res.redirect(`/listings/${id}`);
};