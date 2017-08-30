/*
 *  REQUEST HANDLER
 *  (Core middleware--use()d in server.js)
 *
 *  This module ensures all requests are processed in the correct way.
 *
 *  Generally, the flow for handling requests is:
 *    1. Serve static files (server.js)
 *    2. Serve index.html to React routes
 *    3. Handle API endpoints
 *    4. Serve index.html for React to render a 404
 *
 *  This order should mean that the quickest or simplest
 *  requests are handled first.
 *
 *  Many of these functions make db queries. There's more information on these in the
 *  db module, but importantly you will notice that with neo4j, we can extract the various
 *  aliased fields of a response with the .get() method of a record. This is extremely useful
 *  and we recommend making heavy use of it in order to build and parse complex queries efficiently.
 */

// Node librares
const fs = require('fs');
const path = require('path');
// GitPal module with methods for various endpoints
const routes = require('../routes');

// Cache index.html to serve quickly on React routes and invalid URLs
fs.readFile(path.join(__dirname, '../../dist/index.html'), 'utf8', (err, data) => {
  if (err) {
    throw err;
  } else {
    exports.index = data;
  }
});

/*
  REACT ROUTES
*/
// Serves index.html on react routes
// and redirects /API request to appropriate endpoint
exports.handler = function handler(req, res) {

  // split URL to send to correct request handler
  const urlParts = req.path.split('/');

  // React routes
  if (routes.react.has(urlParts[1])) {
    res.send(exports.index);

  /*
    API ENDPOINTS
  */
  } else if (urlParts[1] === 'API' && routes.api[req.method].hasOwnProperty(urlParts[2])) {
    // Only send meaningful response to authenticated users
    if (req.isAuthenticated()) {
      routes.api[req.method][urlParts[2]](req)
        .then((data) => {
          res.statusCode = 200;
          res.json(data);
        })
        .catch((err) => {
          console.error(err);
          res.end('sorry not sorry');
        });
    } else {
    // Unauthenticated users get 403 and empty data
      res.statusCode = 403;
      res.json([]);
    }

  /*
    AUTHENTICATION ENDPOINTS
  */
  // Handle authentication endpoints--these take req and res mostly for our convenience
  // and to make implementation of passport easier.
  // Consider refactoring similar to the above.
  } else if (urlParts[1] === 'auth' && routes.auth[req.method].hasOwnProperty(urlParts[2])) {
    routes.auth[req.method][urlParts[2]](req, res, urlParts);

  /*
    404 NOT FOUND
  */
  // If a request has still not been handled, it is using an incorrect URL.
  // Send index.html -- React will render NotFound component
  } else  {
    res.statusCode = 404;
    res.end(exports.index);
  }
};
