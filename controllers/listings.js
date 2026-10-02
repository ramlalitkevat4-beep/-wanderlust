const listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN && process.env.MAP_TOKEN !== 'REPLACE_WITH_MAPBOX_TOKEN' ? process.env.MAP_TOKEN : null;
const geoCodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;


module.exports.index = async (req, res) => {
    let alllistings = await listing.find({});
    return res.render('listings/index.ejs', { alllistings });
};

module.exports.renderNewForm = async (req, res, next) => {
    const newListing = new listing({ ...req.body.listing, owner: req.user._id });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    return res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing1) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    return res.render('listings/show.ejs', { listing: listing1 });
};

module.exports.createListing = async (req, res) => {
    if (!geoCodingClient) {
        req.flash('error', 'Mapbox token is missing. Add a valid MAP_TOKEN in .env to enable listing geocoding.');
        return res.redirect('/listings/new');
    }

    const response = await geoCodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new listing({
        ...req.body.listing,
        owner: req.user._id
    });

    newListing.image = {
        url,
        filename
    };

    newListing.geometry = response.body.features[0].geometry;

    const savedListing = await newListing.save();

    console.log(savedListing.geometry);

    req.flash('success', 'Listing created successfully!');

    return res.redirect('/listings');
};



module.exports.randerEditListing = async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id);
    if (!listing1) {
        req.flash("error", "Listing you requisted for data does not exist !");
        return res.redirect("/listings");
    }

    let originalImage = listing1.image?.url;
    if (originalImage) {
        originalImage = originalImage.replace("/upload", "/upload/w_250");
    }
    return res.render("listings/edit.ejs", { listing: listing1 ,originalImage});
};

module.exports.updateListing = async (req, res) => { 
    const { id } = req.params; 

    const updates = { ...req.body.listing };

    if (req.file) { 
        updates.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );

    req.flash("success", "Listing updated successfully");

    res.redirect(`/listings/${id}`); 
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    console.log(deletedlisting);
    return res.redirect('/listings');
};


