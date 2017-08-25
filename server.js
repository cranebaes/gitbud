/*
 * ENTRY POINT TO ALL THE SERVER SIDE CODE
 *
 * Most of the server code is clearly modularised, so this
 * is mostly uncontroversial requires and uses.
 *
 * The other server modules are:
 *    request-handler
 *    --Sends correct response to each URL (mostly by calling appropriate function from routes)
 *    routes
 *    --Contains functions for generating responses (all called from various points in request-handler)
 *    authentication
 *    --Implements passport's GitHub strategy and exports its middleware for use in other modules in order to keep similar code together
 *    profiling
 *    --Builds a profile of user's experience by scraping data from GitHub and builds relationships in the db
 *      by which to sort users in lists.
 */

// Allows storing of environment variables
// in .env of root directory.
require('dotenv').config();
// Libraries for handling requests
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// Libraries for authentication and sessions
const session = require('express-session');
// GitPal modules
const passport = require('./server/authentication').passport;
const requestHandler = require('./server/request-handler');

// Make express server
const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

// Save sessions
// NOTE: This is using a bad memory store
// https://www.npmjs.com/package/express-session#sessionoptions
app.use(session({
  secret: 'This is a secret',
  resave: false,
  saveUninitialized: true,
}));

// Set server to use initialized passport from authentication module
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
// All other enpoints routed in request-handler module
app.use(bodyParser.json());
app.use(requestHandler.handler);
