const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsycn.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');


app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const url = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(url);
}


app.get('/', (req, res) => {
    res.send('hello world');
});

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



app.get('/listings', async (req, res) => {
    let alllistings = await listing.find({});
    res.render('listings/index.ejs',{alllistings});
    
});

// new Route
app.get('/listings/new', (req, res) => {

    res.render('listings/new.ejs');
});



// Show route
app.get('/listings/:id',wrapAsync( async (req, res) => {
     let {id} = req.params;
     const listing1=await listing.findById(id).populate("reviews");
     console.log(await listing1.image);

      res.render('listings/show.ejs',{listing: listing1});
}));


app.post('/listings',validateListing, wrapAsync(async (req, res,next) => {
    const newlisting = new listing(req.body.listing);
   
    await newlisting.save();
    res.redirect('/listings');

    
}));

app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing1=await listing.findById(id);
    res.render('listings/edit.ejs',{listing: listing1});
});

app.put('/listings/:id',validateListing,wrapAsync(async(req,res)=>{
     let {id} = req.params;
    
    await listing.findByIdAndUpdate( id,{ ...req.body.listing }, { new: true });
    res.redirect('/listings');
}))
 
// Delete Route 
app.delete('/listings/:id',async(req,res)=>{
let {id}=req.params;
let deletedlisting =await listing.findByIdAndDelete(id);
console.log(deletedlisting);
res.redirect('/listings');
});


// Reviews  Post route
app.post('/listings/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
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

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params; // id is the listing id and reviewId is the review id
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

//         title: 'test listing',
//         description: 'This is a test listing',
//         image: '',
//         price: 100,
//         locations: 'Test Location',
//         contry: 'Test Country'
//     });
//     await listing1.save();
//     res.send('Test listing created');
// });

app.post("/test-review", (req, res) => {
    console.log("TEST ROUTE REACHED");
    console.log(req.body);

    res.json({
        message: "Test successful",
        body: req.body,
    });
});
app.all("/{*splat}",(req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
   res.status(statusCode).render('listings/Error', { err });
});


main().then(() => {
    console.log('connected to database');
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}).catch((err) => {
    console.log('error connecting to database', err);
});