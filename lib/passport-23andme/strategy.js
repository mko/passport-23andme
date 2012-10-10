/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The 23AndMe Personal Genome API authentication strategy authenticates requests by delegating to
 * 23AndMe Personal Genome API using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your 23AndMe Personal Genome API application's App ID
 *   - `clientSecret`  your 23AndMe Personal Genome API application's App Secret
 *   - `callbackURL`   URL to which 23AndMe Personal Genome API will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new TwentyThreeAndMeStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/23andme/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.23andme.com/authorize';
  options.tokenURL = options.tokenURL || 'https://api.23andme.com/token';
  options.scopeSeparator = options.scopeSeparator || '%20';

  OAuth2Strategy.call(this, options, verify);
  this.name = '23andme';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from 23AndMe. __REQUIRES__ the `names` scope or it will fail.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `23andme`
 *   - `id`               the user's 23AndMe Personal Genome API ID
 *   - `displayName`      the user's full name
 *	 - `firstName`		  the user's first name
 *	 - `lastName`		  the user's last name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.getProtectedResource('https://api.23andme.com/1/names/', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profiles', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: '23andme' };
      profile.id = json.id;
      profile.displayName = json.first_name + ' ' + json.last_name;
      profile.firstName = json.first_name;
      profile.lastName = json.last_name;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;