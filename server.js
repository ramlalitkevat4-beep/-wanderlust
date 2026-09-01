// // server.js
// const express = require('express');
// const path = require('path');
// const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate');
// const bodyParser = require('body-parser'); //This is used to read data submitted through HTML forms.

// const { connect } = require('./db');
// const listingsRoutes = require('./routes/listings');

// const app = express();

// const PORT = process.env.PORT || 8080;

// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));

// connect().catch(err => {
//   console.error('Failed to connect to DB', err);
//   process.exit(1);
// });

// // Routes
// app.get('/', (req, res) => res.send('Hi, I am root'));
// app.use('/listings', listingsRoutes);

// // 404
// app.use((req, res) => {
//   res.status(404).send('Page Not Found!');
// });

// // error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.statusCode || 500).send(err.message || 'Something went wrong');
// });

// app.listen(PORT, () => {
//   console.log('Server listening on port', PORT);
// });
