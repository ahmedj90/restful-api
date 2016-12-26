var express = require('express');
var settings = require(__dirname + '/../config/settings');
const expressJwt = require('express-jwt');   
const authenticate = expressJwt({secret : settings.authenticationTokenSecretKey});

var router = express.Router();

//protected route
router.post('/test', authenticate, function(req, res) {  
  res.status(200).json(req.user);
});


module.exports = router;