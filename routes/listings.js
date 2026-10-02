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
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConFig.js")
const upload=multer({storage:storage,
                        limits:{
                            fileSize:5*1024*1024
                        }
});


// get=index and create post=new listing 
router.route("/")
                .get(wrapAsync(listingController.index))
                .post(isLoggedIn, upload.single('listing[image][url]'), (req, res, next) => {
                    if (!req.file) {
                        return next(new ExpressError(400, 'An image is required'));
                    }
                    req.body.listing.image = {
                        url: req.file.path,
                        filename: req.file.filename
                    };
                    next();
                }, validateListing, wrapAsync(listingController.createListing));
              

// new Route
router.get('/new', isLoggedIn, (req, res) => {
    return res.render('listings/new.ejs');
});


// show  perticular listing and and  edit =post  and delete lsiting 
router.route('/:id')
                    .get(wrapAsync(listingController.showListing))
                    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
                    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

 

 

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.randerEditListing));



// Reviews  Post route
router.post('/:id/legacy-reviews', validateReview, isLoggedIn, wrapAsync(async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    console.log('New review has been added');
    return res.redirect(`/listings/${Listing._id}`);
}));



module.exports = router;