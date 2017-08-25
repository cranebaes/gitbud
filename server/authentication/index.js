// Libraries for authentication
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
// GitPal modules
const db = require('../db');
const profiling = require('../profiling');

// temporary clientID and clientSecret for dev purposes
// https://github.com/organizations/cranebaes/settings/applications/574129
passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    const dbSession = db.driver.session();
    dbSession.run(`
      MERGE
        (user:User { ghId: ${profile._json.id} })
      SET 
        user.avatarUrl = '${profile._json.avatar_url}', user.name = '${profile.displayName}',
        user.rating = 50, user.OAuthToken = '${ accessToken }', user.username = '${profile.username}'
      RETURN user
    `)
      .then((res) => {
        dbSession.close();
        const user = new db.models.ServerUser(res.records[0].get('user'));
        if (!user.profile) {
          profiling.buildUserProfile(user.ghId)
            .then(() => profiling.compareUser(dbSession, user.ghId))
            .catch((err) => {
              console.error(err);
              dbSession.close();
            });
        }
      })
      .catch((err) => {
        console.error(err);
        dbSession.close();
      });
    return done(null, profile);
  }
));

// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  const userInfo = {
    displayName: user.displayName,
    username: user.username,
    profileUrl: user.profileUrl,
    ghInfo: user._json
  }
  done(null, userInfo);
});

// Export passport object as required for app and request-handler
exports.passport = passport;
// Tell passport to use GitHub strategy and set scope
exports.authenticate = passport.authenticate('github', { scope: ['user', 'repo'] });
// Handle callback URL after GitHub authentication
exports.callback = (req, res) => passport.authenticate('github', { failureRedirect: '/' })(req, res, () => res.redirect('/projects'));
