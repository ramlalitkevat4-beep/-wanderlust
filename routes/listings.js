// routes/listings.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

const collectionName = 'listings';

// index
router.get('/', async (req, res, next) => {
  try {
    const db = getDB();
    const allListings = await db.collection(collectionName).find({}).toArray();
    res.render('listings/index', { allListings });
  } catch (err) {
    next(err);
  }
});

// new
router.get('/new', (req, res) => {
  res.render('listings/new');
});

// create
router.post('/', async (req, res, next) => {
  try {
    const listing = req.body.listing;
    if (!listing) return res.status(400).send('Send valid data for listing');
    // convert price to number (if provided)
    if (listing.price) listing.price = Number(listing.price);
    const db = getDB();
    const result = await db.collection(collectionName).insertOne(listing);
    res.redirect(`/listings/${result.insertedId}`);
  } catch (err) {
    next(err);
  }
});

// show
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const listing = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!listing) return res.status(404).send('Listing not found');
    res.render('listings/show', { listing });
  } catch (err) {
    next(err);
  }
});

// edit
router.get('/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const listing = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!listing) return res.status(404).send('Listing not found');
    res.render('listings/edit', { listing });
  } catch (err) {
    next(err);
  }
});

// update
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = req.body.listing;
    if (updated.price) updated.price = Number(updated.price);
    const db = getDB();
    await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: updated }
    );
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

// delete
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();
    await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
