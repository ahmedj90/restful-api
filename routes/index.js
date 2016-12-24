var express = require('express');
var router = express.Router();
 
//var auth = require('./auth.js');
//var products = require('./products.js');
//var user = require('./users.js');
 
/*
 * Routes that can be accessed by any one
 */
//router.post('/login', auth.login);
 
/*
 * Routes that can be accessed only by autheticated users

router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);

*/


/*
 * Routes that can be accessed only by authenticated & authorized users

router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.post('/api/v1/admin/user/', user.create);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
*/



router.get('/', function (request, response) {
  response.send("<h1>Welcome to our Nodejs server!<h/1>");
});

//add new user to db
router.get('/add', function (request, response) {

  db.collection('users').save({name: 'mike', age: 21}, (err, result) => {
    if (err) return console.log(err);

    console.log('saved to database');
    //res.redirect('/');
  });

  response.send("<h1>A new user saved!<h/1>");

});


//print all users
router.get('/show', function (request, response) {

  var str='';
  db.collection('users').find().toArray(function(err, results) {    
    
    for(var i=0;i<results.length;i++){
      str += "user " + i + ": " +results[i].name + "<br>";
    }
    console.log(results);
    response.send("<h1>users</h1><br>" + str);

  });

});

module.exports = router;