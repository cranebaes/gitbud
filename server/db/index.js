/*
 *  DATABASE
 *  (Exports a connected DB object which is used in many places, but
 *  primarily, you will see it in the routes module, which handles
 *  all the endpoints that require db functionality)
 *
 *  This module provides a connected db object for making queries
 *  and a set of models to parse the results of those queries.
 *
 *  We use the neo4j BOLT driver which is good (and fast), but has
 *  its quirks. The workflow we have followed has meant creating a new
 *  session for each query, which may well not be necessary--indeed,
 *  in some places it's possibly led to a race condition. Our recommendations
 *  for using this module better are investigating streaming as well as Promise
 *  sessions (in which one can subscribe to db events, rather than awaiting
 *  Promise resolution) and considering exporting one session but ensuring it is closed.
 *  Good documentation and examples here:
 *    https://github.com/neo4j/neo4j-javascript-driver
 *
 *  THINGS TO FIX:
 *  There's a lot of repeated code across all the db (sub-)modules
 *  which would be great to fix.
 *
 *  Ideally, this module would export a function that takes a query
 *  and returns a promise. This function would itself create a
 *  session, run the query, close the session and then resolve or reject
 *  the output.
 *
 *  Also, there's clearly scope to neaten most of the requests in the routes module
 *  by using the optional parameters object that can be sent with queries. At the moment,
 *  we're mostly using rather hairy template literals which aren't as readable and are
 *  easier to get wrong.
*/

// import neo4 driver
const neo4j = require('neo4j-driver').v1;
// set variables to connect
const url = process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost';
const username = process.env.GRAPHENEDB_BOLT_USERNAME || process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.GRAPHENEDB_BOLT_PASSWORD || process.env.NEO4J_PASSWORD || 'neo';
// connect and create session
exports.driver = neo4j.driver(url, neo4j.auth.basic(username, password));

// exports models to deal with search results
exports.models = require('./models');
