/*
 *  REQUEST HANDLERS FOR AUTHENTICATION ROUTES
 *
 *  These handlers deal with the response directly by convenience, not by good design.
 */

// Required to create a db session and run a query.
// For info on how to do this better, check the hints in the db module.
const db = require('../db');
const dbDriver = db.driver;
const passport = require('../authentication');

module.exports = {
  GET: {
    signout: function signout(req, res) {
      // destroy session and redirect to home
      console.log('LOGGING OUT', req.logout);
      req.logout();
      res.redirect('/');
    },
    authenticated: function checkAuthenticated(req, res) {
      // If user signed in, send account details
      if (req.isAuthenticated()) {
        const dbSession = dbDriver.session();
        dbSession.run(`
          MATCH (user:User {ghId: ${ req.user.ghInfo.id }})
          OPTIONAL MATCH (user)--(:Group)--(project:Project)
          RETURN user, COLLECT(ID(project)) as projects
        `)
          .then((result) => {
            res.json(new db.models.User(result.records[0].get('user'), false, false, result.records[0].get('projects')));
            dbSession.close();
          })
          .catch(() => {
            res.send(false);
            dbSession.close();
          });
      } else {
        // Confirm not signed in
        res.send(false);
      }
    },
    github: function authenticate(req, res) {
      if (req.url === '/auth/github') {
        passport.authenticate(req, res);
      } else if (/^\/auth\/github\/callback/.test(req.url)) {
        passport.callback(req, res);
      } else {
        // Not a valid URL
        res.end(exports.index);
      }
    }
  }
};
