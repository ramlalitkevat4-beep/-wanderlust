const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
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

app.get('/listings', async (req, res) => {
    let alllistings = await listing.find({});
    res.render('listings/index.ejs',{alllistings});
    
});

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});




app.get('/listings/:id', async (req, res) => {
     let {id} = req.params;
     const listing1=await listing.findById(id);
     console.log(await listing1.image);

      res.render('listings/show.ejs',{listing: listing1});
});


app.post('/listings', async (req, res) => {
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect('/listings');
});

app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing1=await listing.findById(id);
    res.render('listings/edit.ejs',{listing: listing1});
});

app.put('/listings/:id',async(req,res)=>{
     let {id} = req.params;
    await listing.findByIdAndUpdate( id,{ ...req.body.listing }, { new: true });
    res.redirect('/listings');
})
 

app.delete('/listings/:id',async(req,res)=>{
let {id}=req.params;

await listing.findByIdAndDelete(id);
res.redirect('/listings');
});


 
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




main().then(() => {
    console.log('connected to database');
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}).catch((err) => {
    console.log('error connecting to database', err);
});