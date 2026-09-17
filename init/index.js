const mongoose = require('mongoose');
const listing = require('../models/listing.js');
const initdata = require('./data.js');


const url = "mongodb://127.0.0.1:27017/wanderlust";
const OWNER_ID = "6aa0247a668101f3d3500b8d";

main().then(() => {
    console.log('connected to database');
    
}).catch((err) => {
    console.log('error connecting to database', err);
});

async function main() {
    await mongoose.connect(url);
}


const initDB=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,owner: OWNER_ID
    }));
    await listing.insertMany(initdata.data);
    console.log('Database initialized with sample data');
};


initDB();
