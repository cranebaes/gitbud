/*
 *  DATABASE MODELS
 *  (Used whenever db results are parsed--mostly
 *  in request-handler)
 *
 *  This module massages neo4j search results
 *  into more convenient objects. The constructors are
 *  essentially parsers. This allows us to abstract the logic
 *  of preparing objects from results and makes it easier to
 *  separate out properties of the results in order to e.g. remove
 *  sensitive information from Users before sending them.
 *
 *  For information on the .toNumber() method, please check:
 *    https://github.com/neo4j/neo4j-javascript-driver#a-note-on-numbers-and-the-integer-type
 *  It is a workaround, provided by the driver, for dealing with  the differences
 *  between JS and neo4j's number representation.
 *
 *  We have (perhaps riskily) assumed that our numbers will not exceed the MAX_SAFE_INTEGER.
*/

exports.User = class User {
  constructor(user, pairs, rating, projects) {
    this.id = user.identity.toNumber();
    this.username = user.properties.username;
    this.name = user.properties.name;
    this.avatarUrl = user.properties.avatarUrl;
    this.ghId =
      'ghId' in user.properties ? user.properties.ghId.toNumber() : null;
    this.rating = rating
      ? rating.properties.difference.toNumber()
      : user.properties.rating.toNumber();
    this.paired = pairs ? pairs.map(pair => pair.toNumber()) : [];
    this.projects = projects
      ? projects.map(project => project.toNumber())
      : this.paired;
    this.language = user.properties.language;
    this.experience = user.properties.experience;
    this.description = user.properties.description;
  }
};

// Includes sensitive information (e.g. OAuthToken) that should not be sent to users
exports.ServerUser = class extends exports.User {
  constructor(user) {
    super(user);
    this.OAuthToken = user.properties.OAuthToken;
    this.profile = user.properties.profile
      ? JSON.parse(user.properties.profile)
      : false;
  }
};

exports.Project = class Project {
  constructor(project, pairs, interested) {
    this.id = project.identity.toNumber();
    this.project = project.properties.project;
    this.language = project.properties.language;
    this.experience = project.properties.experience;
    this.link = project.properties.link;
    this.description = project.properties.description;
    this.paired = pairs ? pairs.map(pair => pair.toNumber()) : [];
    this.interested = interested;
  }
};
