'use strict';

const passport = require('passport');  
const Strategy = require('passport-local');
const validation = require(__dirname + '/../libs/validation');
var localization = require(__dirname + '/../libs/localization');

var Hash = require('password-hash');

var models = require(__dirname + '/../models');


//login startegy
passport.use(new Strategy(  
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    function(email, password, done) {
        var EmailValidator = validation.isEmail(email, localization.translate("fldEmail"));
        var PasswordValidator = validation.isPassword(password, localization.translate("fldPassword"));

        if(EmailValidator.valid === false){
          return done(null, false, {message: EmailValidator.error});           
        }

        if(PasswordValidator.valid === false){
          return done(null, false, {message: PasswordValidator.error});
        }

        //use model to compare with db
        models.User.findOne({ email: email }, function(err, user) {
           // if there are any errors, return the error before anything else
           if (err)
              return done(err);

           // if no user is found, return the message
           if (!user)
                return done(null, false, {messsage: localization.translate("userNotFoundErr")}); // req.flash is the way to set flashdata using connect-flash

           // if the user is found but the password is wrong
           if (!Hash.verify(password, user.password))
                return done(null, false, {message: localization.translate("userOrPasswordInvalidErr")}); // create the loginMessage and save it to session as flashdata

           // all is well, return successful user
           return done(null, user);

        });
/*


    // database dummy - find user and verify password
    if(username === 'ali' && password === '666'){
      done(null, {
        id: mongoose.Types.ObjectId(),
        firstname: 'ali',
        lastname: 'name',
        email: 'devil@he.ll',
        verified: true,
        crap: 'crap message'
      });
    }
    else {
      done(null, false);
    }*/
    
  }
));

module.exports = passport;