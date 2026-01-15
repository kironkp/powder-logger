// IMPORTS
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
// EXPRESS SESSION MIDDLEWARE:
const session = require('express-session');
// this allows use to "findById in (req.session.user._id"
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
// Express static middleware:
const path = require('path')
const authController = require('./controllers/auth.js');
const applicationController = require('./controllers/applications.js')
const port = process.env.PORT ? process.env.PORT : '3000';


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// express static middleware:
app.use(express.static(path.join(__dirname, 'public')))


// this is the middleware for EXPRESS SESSION allows to find user ID
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView)



app.get('/', (req, res) => {
  // Check if the user is signed in
  if (req.session.user) {
    // Redirect signed-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    // Show the homepage for users who are not signed in
    res.render('home.ejs');
  }
});

// browser only gets POST and GET
// method = delete is quiry param

// the methodOverride : _method delete is built into method-override
// method override is in our package.json dependency

app.use('/auth', authController);
// checks if user is signed in
app.use(isSignedIn)
app.use('/users/:userId/applications', applicationController)
// allows you to just use / in applications.js for applicationsController

// SERVER LISTENER
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
