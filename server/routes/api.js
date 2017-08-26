/*
 *  Request handlers for API routes.
 *  These are stored on an object for easy lookup in the request-handler module and are indexed
 *  first by method then by route.
 *
 *  THINGS TO FIX:
 *  There's a lot of repeated code in the db queries. You may find it helpful to create better helper functions
 *  here, simply modularise the db functionality better or both.
 *  Suggestions in the db module.
*/

// Required to create a db session and run a query.
// For info on how to do this better, check the hints in the db module.
const db = require('../db');
const dbDriver = db.driver;


module.exports = {
  GET: {
    /*
      GET METHODS
    */
    // Returns an object with numerical properties representing
    // project IDs each with a value of an array of checkpoints of the form
    // { text: prompt(string), hint: hint on how to tackle prompt(string), complete: completion status of prompt(bool) }
    progress: function getProgress(req) {
      return new Promise((resolve, reject) => {
        console.log('GET progress');
        const dbSession = dbDriver.session();
        dbSession.run(`
          MATCH (:User {ghId: ${req.user.ghInfo.id}})-->(group:Group)-->(project:Project)
          RETURN group, project
        `)
          .then((res) => {
            const projectProgress = {};
            res.records.forEach((record) => {
              const group = record.get('group').properties;
              projectProgress[record.get('project').identity] = group.progress ? JSON.parse(group.progress) : [];
            });
            resolve(projectProgress);
          })
          .catch(reject);
      });
    },

    // Returns an object with numerical properties representing
    // users IDs each with a value of an array of messages of the form
    // { text: message(string), sender: whether or not the requesting user is the sender(bool) }
    messages: function getMessages(req) {
      return new Promise((resolve, reject) => {
        console.log('GET messages');
        const dbSession = dbDriver.session();
        dbSession.run(`
          MATCH (:User {ghId: ${req.user.ghInfo.id}})-[to_user]-(message:Message)--(other:User)
          RETURN message, to_user, other ORDER BY message.created_at DESC
        `)
          .then((res) => {
            const messages = {};
            res.records.forEach((record) => {
              const text = record.get('message').properties.text;
              const userId = record.get('other').identity.toNumber();
              const sender = record.get('to_user').type === 'SENT';
              messages[userId] = messages[userId]
                ? messages[userId].concat({ sender, text })
                : [{ sender, text }];
            });
            resolve(messages);
          })
          .catch((err) => {
            reject(err);
            dbSession.close();
          });
      });
    },

    // Returns an array of user objects interested in the given project id
    // NOTE: The relative xp is a relationship between users
    // calculated and stored for new users in the profliing module.
    // The User model stores this relationship between returned users and the
    // requesting user as the rating property on the returned User object.
    users: function getUsers(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('GET users');
        const ghId = req.user.ghInfo.id;
        const projectId = Number(req.query.projectId);
        dbSession.run(`
          MATCH (user:User {ghId: ${ghId}})<-[xp:EXPERIENCE_DIFFERENCE]->(pair:User)
          WITH user, pair, xp
          MATCH (pair)-->(group:Group)<--(user),
            (group)-->(pairedProject:Project),
            (pair)-[:INTERESTED_IN]->(project:Project)
          WHERE ID(project) = ${projectId}
          OPTIONAL MATCH (pair)--(:Group)--(pairsProjects:Project)
          RETURN pair, COLLECT(ID(pairedProject)) as projects, COLLECT(ID(pairsProjects)) as pairsProjects, xp
          UNION
          MATCH (user:User {ghId: ${ghId}})<-[xp:EXPERIENCE_DIFFERENCE]->(pair:User)
          WITH user, xp, pair
          MATCH (pair)-[:INTERESTED_IN]->(project:Project)
          WHERE ID(project) = ${projectId} AND NOT (pair)-->(:Group)<--(:User {ghId: ${ghId}})
          OPTIONAL MATCH (pair)--(:Group)--(pairsProjects:Project)
          RETURN pair, false as projects, COLLECT(ID(pairsProjects)) as pairsProjects, xp
        `)
          .then((res) => {
            resolve(
              res.records.map(user =>
                new db.models.User(user.get('pair'), user.get('projects'), user.get('xp'), user.get('pairsProjects'))
              )
                .sort((a, b) => a.rating - b.rating)
            )
          })
          .catch(reject)
          .then(() => dbSession.close());
      });
    },

    // Returns an array of project objects.
    // Returns all the projects in the database.
    projects: function getProjects(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('GET projects');
        const ghId = req.user.ghInfo.id;
        dbSession.run(`
            MATCH (user:User {ghId: ${ghId}})-->(group:Group)-->(project:Project)
            WITH user, group, project
            MATCH (pair:User)-->(group)-->(project)
            WHERE NOT pair = user
            RETURN COLLECT(ID(pair)) as pairs, true as interested, project
            UNION
            MATCH (user:User {ghId: ${ghId}})-[:INTERESTED_IN]->(project:Project)
            WHERE NOT (user)-->(:Group)-->(project)
            RETURN false as pairs, true as interested, project
            UNION
            MATCH (user:User {ghId: ${ghId}}), (project:Project)
            WHERE NOT (user)-->(:Group)-->(project) AND NOT (user)-[:INTERESTED_IN]->(project)
            RETURN false as pairs, false as interested, project
         `)
          .then((res) => {
            resolve(res.records.map(project =>
              new db.models.Project(project.get('project'), project.get('pairs'), project.get('interested'))
            ));
          })
          .catch(reject)
          .then(() => dbSession.close());
      });
    },

    // Returns an array of user objects--one for each
    // user with which the requesting user is paired
    pairs: function getPairs(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('GET pairs');
        const ghId = req.user.ghInfo.id;
        dbSession.run(`
          MATCH (pair:User)-->(group:Group)<--(user:User)
          WHERE user.ghId = ${Number(ghId)}
          RETURN pair
         `)
          .then((res) => {
            resolve(res.records.map(project =>
              res.records.map(user => new db.models.User(user.get('pair')))
            ));
          })
          .catch(reject)
          .then(() => dbSession.close());
      });
    }

  },

  /*
    POST METHODS
  */
  POST: {
    // Sets requesting user's interest in a project from given project ID
    projects: function projects(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('POST projects');
        dbSession.run(
          `
          MATCH (user:User) WHERE user.ghId=${Number(req.user.ghInfo.id)}
          MATCH (project:Project) WHERE ID(project) = ${Number(req.body.projectId)}
          MERGE (user)-[:INTERESTED_IN]->(project)
          return user, project
          `
        )
          .then((res) => {
            resolve(res);
          })
          .catch(reject)
          .then(() => dbSession.close());
      });
    },

    // Sets requesting user as working on the project with project ID
    // with the user with the given user ID
    pair: function addPair(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('POST pair');
        dbSession.run(`
          MATCH (project:Project) WHERE ID(project) = ${Number(req.body.project)}
          MATCH (user:User) WHERE user.ghId = ${Number(req.user.ghInfo.id)}
          MATCH (pair:User) WHERE ID(pair) = ${Number(req.body.partnered)}
          MERGE (user)-[:PAIRED_WITH]->(group:Group)<-[:PAIRED_WITH]-(pair)
          MERGE (group)-[:WORKING_ON]->(project)
          SET group.progress = project.structure
          return user, pair, group, project
        `)
          .then(resolve)
          .catch(reject)
          .then(() => dbSession.close());
      });
    },

    // Adds a new message from the requesting user to the database
    messages: function sendMessage(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        const message = req.body;
        console.log('POST messages');
        dbSession.run(`
          MATCH (user:User {ghId: ${ req.user.ghInfo.id }}), (recipient:User)
          WHERE ID(recipient) = ${ req.body.recipient }
          CREATE (user)-[:SENT]->(:Message {text: '${ req.body.text.replace('\'', '\\\'') }', created_at: TIMESTAMP()})-[:RECEIVED]->(recipient)
        `)
          .then(() => {
            resolve();
            dbSession.close();
          })
          .catch((err) => {
            reject(err);
            dbSession.close();
          })
      });
    },

    // Updates a group's progress in the database.
    // NOTE: As users work in groups (currently pairs), their progress
    // is stored on group nodes not user nodes.
    // It's stored as JSON, as the database cannot hold objects per se
    // and the databse has no need to udnerstand or operate on the data as an object.
    progress: function updateProgress(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('POST progress')
        dbSession.run(`
          MATCH (:User {ghId: ${req.user.ghInfo.id}})-->(group:Group)-->(project:Project)
          WHERE ID(project) = ${req.body.projectId}
          SET group.progress = '${JSON.stringify(req.body.progress).replace('\'', '\\\'')}'
        `)
          .then(resolve)
          .catch(reject)
          .then(() => dbSession.close());
      });
    },

    // Updates the db with data from the questionnaire.
    users: function addQuestionnaireData(req) {
      return new Promise((resolve, reject) => {
        const dbSession = dbDriver.session();
        console.log('POST users');
        dbSession.run(`
          MATCH (user:User) WHERE user.ghId = ${Number(req.user.ghInfo.id)}
          SET user.description = '${req.body.description}'
          SET user.language = '${req.body.language}'
          SET user.experience = '${req.body.experience}'
        `)
          .then(() => resolve())
          .catch(reject);
      });
    }
  },

};
