'use strict';

const passport = require('passport');  
const Strategy = require('passport-local');

//login startegy
passport.use(new Strategy(  
 {
        usernameField: 'username',
        passwordField: 'password',
    },
  function(username, password, done) {
    // database dummy - find user and verify password
    if(username === 'ali' && password === '666'){
      done(null, {
        id: 666,
        firstname: 'ali',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true,
        crap: 'crap message'
      });
    }
    else {
      done(null, false);
    }
  }
));

module.exports = passport;