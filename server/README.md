# GitPal Server

> Most server code is clearly modularized and heavily (perhaps excessively) annotated for the benefit of teams wishing to inherit this codebase. On the understanding that comments can become inaccurate over time and that people may want to understand the what module does what before jumping in, we're providing short notes here.
> We prefer each file to fulfill one role so modules with diverse responsibilities (_e.g._ the _routes_ module, which exports request handlers for _/API/_ and _/auth/_ routes) will generally have one file for each responsibility and a short _index.js_ that draws together exports functionality from the module's distinct files.
> This modularization was intended to be clear, not perfect. You may wish to reorganize some code; for instance, the distinction between request-handler and routes is a little confusing and perhaps artificial.
__Note:__ We've aimed to use the names of React components in this documentation, which will hopefully make it easier to cross-reference with the front-end code. Components are marked by JSX style tags (_e.g._ <App> component).

## Table of Contents

1. [Modules](#modules)
1. [Handling A Connection](#handling-a-connection)
    1. [Order of resolution](#order-of-resolution)
    1. [Path of a request](#path-of-a-request)
        1. [New user](#new-user)
        1. [API request](#api-request)


## Modules
- __Authentication__ Initialises and exports middleware for authentication;
- __DB__ Initialises and exports DB connection;
- __Request Handler__ Invokes appropriate request handler and sends resulting data;
- __Routes__ Exports React routes information and request handlers for API and authentication routes;

## Handling a connection
The entry point for all backend code is _/server.js_, which is a very short file. It simply creates an express app, starts its listening, adds necessary middleware (_e.g._ for handling sessions and body parsing) and then defers to request-handler for all handling of requests.

### Order of resolution
Request handler follows very simple steps:
1. Firstly, it checks whether or not the request is for a valid React route (stored in a Set in the _routes_ module) and if so simply responds with index.html (stored in memory and exported from the _request-handler_ module for a quicker, simpler response);
1. Then, it checks whether the request is for an _/API/_ route and if so, invokes the correct request-handler from the API object exported from the _routes_ module if the user is authenticated and responds with the resulting data or sends a 403 and empty array if not;
1. Then, it checks whether the request is for an _/auth/_ route and defers to the _auth_ object exports from the _routes_ module as above, but sending the response object as well, so that authentication functions can respond directly;
1. Finally, it sends a 404 response with index.html, so that React can render a <NotFound> component.

### Path of a request
This depends heavily on the nature of the request, so we've provided two examples:
- A new user logging in for the first time;
- An authenticated user, making a GET request to _/API/users/_ when viewing a <ProjectDetails> page.

#### New user
When a new user clicks on _'Sign in with GitHub'_ on the <Landing> component with which all users are greeted the following things happen:
1. The user is redirected to GitHub's OAuth page and (after successful authorisation) punted back to _/auth/github/callback_.
1. Their _req_ hits _server.js_ and is handed on (with a request and a response object) to the handler function exported from the _request-handler_ module.
1. This functions tests in the order above and finds that the user has requested an _/auth/_ route, checks whether or not the object exported by _/server/routes/auth.js/_ has a _github_ function and invokes it with the _req_ and _res_ objects.
1. The _github_ function verifies that this is an OAuth callback and invokes the appropriate middleware exported from the authentication module.
1. This middleware (_exports.callback_) mostly defers to other passport functionality, redirecting back to _/_ on failure and _/projects_ on successful authentication, so at this point the _req_ is handled and _res_ (a redirect) has been sent.
1. Passport provides a set of useful functions, which are invoked after (I think) the _req_ is authenticated and which we use to handle our knowledge of the user.
    1. Firstly, it provides a callback function (used to initialise the passport object), which is passed the authenticated user's OAuth token and profile from the OAuth provider. The function we provide inserts the user into the database (if not already present) and ensures that their information matches the latest from GitHub. If they are a new user. it then begins the process of scraping information from GitHub to profile their experience and compare to other users.
    1. Passport also provides _serializeUser_ which is passed the user's whole profile from the OAuth provider (here, a whole load of info from GitHub) and whose return value will be stored on the user's session in the internal ([deliberately flimsy](https://www.npmjs.com/package/express-session#sessionoptions)) store. We use this opportunity to extract the information we want and store it in the layout we want and ignore the rest.
1. As this is a new user, their GitHub ID is passed into a chain of promises from the (poorly name) _profiling_ module, which:
    1. Scrapes all of their repos from GitHub's API and returns those repos which they created or have committed to;
    1. Checks the how many KBs of which languages have been written in those repos and returns that on the user's experience profile;
    1. Tots up the basic stats from their repos (stars, watchers, forks) and returns that on the user's experience profile;
    1. Stores it that information on the user's node in the db;
    1. Finally, the user's GitHub ID is passed to the _compareUser_ function, which grabs their experience profile and finds the distance between it and every other user's, so that _/API/user_ results can be returned with nearest neighbours first.

#### API request
When an authenticated user makes a GET request to _/API/users/_, the following things happen:
1. Their _req_ hits _server.js_ and the handler function from the _request-handler_ module is invoked as middleware.
1. Handler runs through the [checklist of possible requests](#order-of-resolution), finds that this is an _/API_ request, checks that the API object exported from the _routes_ module has a request-handler for this path and invokes it with the _req_ object.
1. The request handler for _/API/users_ instantiates a database session, gets the user's GitHub ID from the user's request (info added by express-session from its memory store) and gets the project ID from the _req_ object's URL parameters.
1. It then queries the DB, combining the results from two queries:
    1. The first returns users with whom the requesting user is paired, along with the IDs of projects on which they're working and the distance between their experience and the requesting user's;
    1. The second returns the same information from users with whom the requesting user is not paired.
1. The results are then map()ed, parsing each returned record with a DB model (a set of pseudoclassical constructors that imply a schema--post hoc--onto DB results) that returns a consistent User object. The resulting array is sorted by experience (the rating property of users at this point represent the distance between their experience-smaller numbers mean more similar experience) and resolve()d.
1. The request-handler which invoked this function has a .then which receives the resolve()d array, and sends it back to the user as JSON with an OK status code, using the _res_ object's methods.
