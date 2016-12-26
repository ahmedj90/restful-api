var express = require('express');
var passport = require(__dirname + '/../modules/passport');
var settings = require(__dirname + '/../config/settings');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');   
const authenticate = expressJwt({secret : settings.authenticationTokenSecretKey});

var router = express.Router();

router.use(passport.initialize()); //intialize passport strategies.

/*
Calls constructor method in passport.js. Which will check if the sent username and password exist in DB, it will store an object 
of the user information inside the request object (a shared global object and can be accessed anywhere).
*/
router.post('/auth', passport.authenticate(  
  'local', {
    session: false
}), serialize, generateToken, respond);


/*
if Authentication succeeds, this method is called first. 
This is where you_pick_ the properties you want to store in the token so you can retrive it later.
*/
function serialize(req, res, next) {    
    //basially, overwrite the user object in req to put only properties you want to stroe in the token.
    req.user = {
      id: req.user.id
    };

    //call generateToekn
    next();
}

/*
if Authentication succeeds, this method is called second. 
This funciton generates random token and encrypts user information in it for retriaval later.
*/
function generateToken(req, res, next) {    
  req.token = jwt.sign({
    id: req.user.id,
  }, settings.authenticationTokenSecretKey, {
    expiresIn: 3600 //seconds
  });
  next();
}

/*
if Authentication succeeds, this method is called third. 
This funciton sends response back to the client with the serialized user information and generated token.
*/
function respond(req, res) {  
  res.status(200).json({
    user: req.user,
    token: req.token
  });
}


module.exports = router;