const listing = require("./models/listing");
const Review=require("./models/review")
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error", "you must be logged in ");
    return res.redirect("/login");
}
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    let listing1 =await listing.findById(id);
    if(!listing1.owner._id.equals(req.user._id)){
        req.flash("error", "you are not the owner of this ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
     let { error } = listingSchema.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));
     }
     next();
}

module.exports.validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, msg));
     }
     next();
}