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
    url:String,
    filename:String,
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
        },
    ],
    owner:{
        type: schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }

}
);

listingSchema.post("findOneAndDelete", async function(listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model('listing', listingSchema);

module.exports = listing;
