const mongoose = require('mongoose');
const listing = require('../models/listing.js');
const initdata = require('./data.js');


const url = "mongodb://127.0.0.1:27017/wanderlust";

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
    await listing.insertMany(initdata.data);
    console.log('Database initialized with sample data');
}

initDB();
