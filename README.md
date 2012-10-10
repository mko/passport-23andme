# Passport-23AndMe

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [23AndMe's Personal Genome API](https://api.23andme.com) using the OAuth 2.0 API.

## Installation

    $ npm install passport-23andme

## Usage

#### Configure Strategy

The 23AndMe Personal Genome API authentication strategy authenticates users using a 23AndMe Personal Genome API account and
OAuth tokens.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user, as well as `options` specifying a
consumer key, consumer secret, and callback URL.

    passport.use(new TwentyThreeAndMeStrategy({
        consumerKey: TWENTYTHREEANDME_CONSUMER_KEY,
        consumerSecret: TWENTYTHREEANDME_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/23andme/callback",
        scope: "basic names haplogroups"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ userId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'23andme'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/23andme',
      passport.authenticate('23andme'),
      function(req, res){
        // The request will be redirected to 23AndMe Personal Genome API for authentication, so this
        // function will not be called.
      });

    app.get('/auth/23andme/callback',
      passport.authenticate('23andme', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits
  - [Michael Owens](https://github.com/mowens)

## Thanks
  - [Jared Hanson](https://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2012 Michael Owens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.