var express = require('express');
var configs = require(__dirname + '/../configs');
const expressJwt = require('express-jwt');   
const authenticate = expressJwt({secret : configs.Settings.authenticationTokenSecretKey});

var router = express.Router();

//protected route
router.post('/test', authenticate, function(req, res) {  
  res.status(200).json(req.user);
});


module.exports = router;