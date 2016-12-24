const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const routes = require('./routes');
const app = express();

var morgan   = require('morgan');  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var mongoose = require('mongoose');              // mongoose for mongodb 
var database = require('./config/database');
var log = require('./config/log');

var db;
 
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


//middleware calls 
app.use('/', routes);   //define routes
app.use(morgan('combined', {stream: log.accessLogStream})); // log requests to the console
app.use(bodyParser.json());  // parse application/json

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

mongoose.connect(database.url);  


MongoClient.connect(database.url, (err, database) => {
    if (err) {
       console.log(err);
       process.exit(1);
    }
    

    db = database;

    var server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + server.address().port);
    });
          
});


