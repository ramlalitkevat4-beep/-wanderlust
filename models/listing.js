const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review=require("./review")
const listingSchema = new schema({
    title: {
        type: String,
        required: true
    }
    ,
    description: {
        type: String,
      
    },
  image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1644333192141-1135d690734f?..."
    }
}
    ,
    price: {
        type: Number,
        required: true,
        default: 0
    },
    location: {
        type: String,
        
    }, country: {
        type: String,
     
    },

   
    reviews:[
        {
            type: schema.Types.ObjectId,
            ref: "Review",
        }
    ]
}
);

listingSchema.post("findOneAndDelete", async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model('listing', listingSchema);

module.exports = listing;
