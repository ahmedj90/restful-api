// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var localization = require(__dirname + '/../libs/localization');

// create a schema
var clientSchema = new Schema({
  refreshToken: {type: String, index: true, unique: true},  
  userId: Schema.ObjectId, 
  createdAt: { type : Date, default: Date.now },
  lastUsedDate: { type : Date, default: Date.now },
  clientInformation: {}
});

clientSchema.statics.findUserOfToken = function (refreshToken, cb) {
    //get userId of the sent refreshToekn
    this.findOne({ 
        refreshToken: refreshToken
    }, function(err, client) {
        if (err) {
          return cb(err, false); 
        }

        //client not found in db
        if(!client){
          return cb(null, false); 
        }

        //if client found, then bring the user object belogs to it
        User.findOne({_id: client.userId}, function(err, user) { 
            if (err) {
              return cb(err, null); 
            }

            //user not found in db
            if(!user){
              return cb(null, false);
            }

            cb(null, user);
        });        
    });

}


// we need to create a model using it
var Client = mongoose.model('Client', clientSchema);

// make this available to our users in our Node applications
module.exports = Client;