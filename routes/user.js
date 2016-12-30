var express = require('express');
var passport = require(__dirname + '/../middlewares/passport');
var configs = require(__dirname + '/../configs');
var models = require(__dirname + '/../models');
var Common = require('./common');

const localization = require(__dirname + '/../libs/localization');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');   //Middleware that validates JsonWebTokens and sets req.user.
const authenticate = expressJwt({secret : configs.Settings.authenticationTokenSecretKey});  //validate access token and set req.user if valid.

var router = express.Router();


//////////////////////
// server responses //
//////////////////////
const respond = {
  auth: function(req, res) {
    return Common.jsonResponse(res, 200, true, null, { user: req.user, token: req.token });
  },
  token: function(req, res) {
    return Common.jsonResponse(res, 201, true, null, { token: req.token });  
  },
  reject: function(req, res){
    return Common.jsonResponse(res, 200, true);    
  }
};


/*
Calls constructor method in passport.js. Which will check if the sent username and password exist in DB, it will store an object 
of the user information inside the request object (a shared global object and can be accessed anywhere).
*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {      
      return Common.jsonResponse(res, 500, false, [localization.translate("loginFailedErr")]);
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {     
      return Common.jsonResponse(res, 401, false, [localization.translate("userOrPasswordInvalidErr")]);      
    }

    req.user = user;
    next();
        
  })(req, res, next);
},  serializeUser, generateAccessToken, generateRefreshToken, respond.auth);


router.post('/me', authenticate, function(req, res) {  
  return Common.jsonResponse(res, 200, true, null, req.user);  
});

router.post('/token', validateRefreshToken, generateAccessToken, respond.token);
router.post('/token/reject', rejectToken, respond.reject);


//This is just for test. The signup model is part of the website.
router.post('/signup', function(req, res) {

  try {
      if(req.body.email && req.body.password){
        //create new user doc
        var user = new models.User({email: req.body.email,
                             password: req.body.password});    
        //save doc
        user.save(function(err) {
          if (err) {
             res.send("failed to register!");   
          }

          console.log("--ahmedDebug: we added new user");
           
        });
        req.user = user; 

        res.status(200).json(user);
      }
      else{
        res.send("make sure to enter email and password! Validation error occured"); 
      }

  }
  catch (e) {
    console.log("--entering catch block--");
    console.log(e);
  }


});



////////////
// helper //
////////////

/*
if Authentication succeeds, this method is called first. 
This is where you_pick_ the properties you want to store in the token so you can retrive it later.
*/
function serializeUser(req, res, next) {    
    //basially, overwrite the user object in req to put only properties you want to stroe in the token.
    req.user = {
      id: req.user.id
    };

    //call generateToken
    return next();
}

function validateRefreshToken(req, res, next) {
  if(!req.body.refreshToken){
    return Common.jsonResponse(res, 400, false, null, localization.translate("refreshTokenMissingErr"));
  }

  Client.findUserOfToken(req.body.refreshToken, function(err, user, info) {
    if (err) {
      return Common.jsonResponse(res, 400, false, null, localization.translate("accessTokenRenewFailErr"));
    }    

    if(!user) //couldn't find session in db
      return Common.jsonResponse(res, 400, false, null, localization.translate("refreshTokenNotFoundErr"));

    req.user = user;
    next();
  });
}

function rejectToken(req, res, next) {
  db.client.rejectToken(req.body, next);
}


//////////////////////
// token generation //
//////////////////////


/*
if Authentication succeeds, this method is called second. 
This funciton generates random token and encrypts user information in it for retriaval later.
*/
function generateAccessToken(req, res, next) {
  req.token = req.token ||  {};
  req.token.accessToken = jwt.sign({
    id: req.user.id
  }, configs.Settings.authenticationTokenSecretKey, {
    expiresIn: configs.Settings.accessTokenExpireTime
  });

  next();
}

function generateRefreshToken (req, res, next) {
    req.token.refreshToken = crypto.randomBytes(40).toString('hex');

    //create new client doc
    var client = new models.Client({refreshToken: req.token.refreshToken,
                             userId: req.user.id,
                             clientInformation: req.body.clientInformation});
    //save doc
    client.save(function(err) {
      if (err) {
        return Common.jsonResponse(res, 400, false, null, localization.translate("refreshTokenGenerationFailErr"));
      }

      next();
    });
}



module.exports = router;