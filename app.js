const express = require('express');
const routes = require('./routes');
const localization = require('./libs/localization');
const app = express();
const jwt = require('jsonwebtoken');
var Localize = require('localize'); //string localization library
var morgan   = require('morgan');  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var mongoose = require('mongoose');              // mongoose for mongodb 
var configs = require('./configs');
var connectionString = configs.Database.url + configs.Database.name;
mongoose.Promise = require('bluebird'); //avoid mongoose deprecated promises error
mongoose.connect(connectionString);

// Start the server
app.set('port', process.env.PORT || 3000);

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed

//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.use(morgan('combined', {stream: configs.Log.accessLogStream})); // log requests to the console
app.use(bodyParser.json());  // parse application/json

app.use('/user', routes.User);   //define routes for http://localhost/user/
app.use('/lyric', routes.Lyric);   //define routes for http://localhost/lyric/

/*
app.use(function(request, response, next) {
        var lang = request.session.lang || "en";
        Localize.setLocale(settings.defaultLanguage);
        next();
});*/

/*
Check why a user is unathorized and return response based on that.
@return error 406 if user has an expired access token, and 401 if the user is not signed in at all (no token presented).
*/
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      if(req.body.accessToken){   //user has access token
          jwt.verify(req.body.accessToken, configs.Settings.authenticationTokenSecretKey, function(err, decoded) {
            if (err && err.name == 'TokenExpiredError') { // it should
              return routes.Common.jsonResponse(res, 406, false); //not acceptable, to indicate that new access token needed.
            }          
          });
      }
      
      //user is not singed in at all (no access token was sent)
      return routes.Common.jsonResponse(res, 401, false, [localization.translate("userNotAuthenticatedErr")]);
    }
});

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


/*

MongoClient.connect(database.url, (err, database) => {
    if (err) {
       console.log(err);
       process.exit(1);
    }
    

    db = database;

          
});*/


