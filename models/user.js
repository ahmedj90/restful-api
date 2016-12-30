// grab the things we need
var mongoose = require('mongoose');
var Hash = require('password-hash');
var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
  email: {type: String, required: true, lowercase: true, unique: true, index: true},
  password: {type: String, required: true, 
             set: function(newValue) {
                    return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
                  } 
  }
});

// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;