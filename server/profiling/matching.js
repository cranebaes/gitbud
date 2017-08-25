/*
 *  MATCHING
 *  (Used as part of a Promise chain in the authentication module for handling new users.
 *  Invoked after the new user's  experience profile has been built in /profiling/index.js)
 * 
 * This implements an incredibly rudimentary matching algorithm, essentially by establishing a user's
 * nearest neighbours. It does this by finding the 'distance' between the new user and every other
 * across several dimensions and using the Pythagorean theorem to squash that distance down into one dimension.
 * I'm not very mathsy, so if you think that any element of this is silly or wrong... you're probably right!
 * 
 * THINGS TO FIX:
 * 
 * Currently, this is composed of a number of asynchronous components and only a few users, so the computationally
 * expensive components are A) not too expensive and B) frequntly interrupted by other requests. Consequently, this won't
 * make the server unresponsive. However, as the number of users grows, node's single threaded model may cause problems here.
 * Possible solutions are to:
 *  --Keep the server responsive by having multiple threads handle requests using cluster.fork();
 *  --Offload this processing to a separate thread once the user is authenticated using child_process.fork();
 *  --Run this as a cron job, regularly checking for new users and matching them.
 * 
 */

// Libraries
const forEach = require('lodash/forEach');
const map = require('lodash/map');
const union = require('lodash/union');
// GitPal modules
const db = require('../db');

module.exports = function compareUser(dbSession, ghId) {
  return dbSession.run(`
    MATCH (user:User {ghId: ${ghId}})
    RETURN user
    UNION
    MATCH (user:User) WHERE NOT user.ghId = ${ghId}
    RETURN user
  `)
    .then((res) => {
      // Get current user and other users, and create object to store comparisons
      const user = new db.models.ServerUser(res.records[0].get('user'));
      const comparators = map(res.records.slice(1), record => new db.models.ServerUser(record.get('user')));
      const comparisons = {};
      // Compare against every other user
      forEach(comparators, (comparator) => {
        let difference = Math.pow(comparator.profile.repoStats - user.profile.repoStats, 2);
        const languages = union(Object.keys(user.profile.languages), Object.keys(comparator.profile.languages));
        forEach(languages, (language) => {
          difference += Math.pow((user.profile.languages[language] || 0) - (comparator.profile.languages[language] || 0), 2);
        });
        comparisons[comparator.ghId] = Math.round(Math.sqrt(difference));
      });
      // Save comparisons in db as relationships
      return dbSession.run(`
        MATCH (user:User {ghId: ${user.ghId}})
        ${ 
          map(comparators, comparator => `
            WITH user
            MATCH (comparator:User {ghId: ${comparator.ghId}})
            MERGE (user)-[:EXPERIENCE_DIFFERENCE {difference: ${comparisons[comparator.ghId]}}]->(comparator)
          `)
          .join('\n')
        }
      `)
        .then((res) => {
          dbSession.close();
          return res;
        })
    });
};
