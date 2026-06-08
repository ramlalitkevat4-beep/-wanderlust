const mongoose = require('mongoose');
const schema = mongoose.Schema;

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
        type: String,
        default: "https://images.unsplash.com/photo-1644333192141-1135d690734f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>{ v===""?"https://images.unsplash.com/photo-1644333192141-1135d690734f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v}
    }

    ,
    price: {
        type: Number,
        
    },
    locations: {
        type: String,
        
    }, contry: {
        type: String,
     
    }
}
);

const listing = mongoose.model('listing', listingSchema);

module.exports = listing;
