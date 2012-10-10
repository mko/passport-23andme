var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , TwentyThreeAndMeStrategy = require('passport-23andme').Strategy;

var TWENTYTHREEANDME_APP_ID = "--insert-23andme-app-id-here--"
var TWENTYTHREEANDME_APP_SECRET = "--insert-23andme-app-secret-here--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete 23AndMe Personal Genome API profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the TwentyThreeAndMeStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and TwentyThreeAndMe
//   profile), and invoke a callback with a user object.
passport.use(new TwentyThreeAndMeStrategy({
    clientID: TWENTYTHREEANDME_APP_ID,
    clientSecret: TWENTYTHREEANDME_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/23andme/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's 23AndMe Personal Genome API profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the 23AndMe Personal Genome API account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'congrats daltonc' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/23andme
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in 23AndMe Personal Genome API authentication will involve
//   redirecting the user to 23andme.com.  After authorization, 23AndMe Personal Genome API will
//   redirect the user back to this application at /auth/23andme/callback
app.get('/auth/23andme',
  passport.authenticate('23andme'),
  function(req, res){
    // The request will be redirected to 23AndMe Personal Genome API for authentication, so this
    // function will not be called.
  });

// GET /auth/23andme/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/23andme/callback', 
  passport.authenticate('23andme', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}