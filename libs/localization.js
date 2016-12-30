var Localize = require('localize');
var configs = require(__dirname + '/../configs');

//load dictionary
var myLocalize = new Localize({
    "emptyFieldErr:$[1]": {
    	"us": "$[1] is empty."
    },
    "invalidDataTypeErr:$[1]": {
    	"us": "$[1] has incorrect value."
    },
     "invalidFormatErr:$[1]": {
    	"us": "$[1] looks weird."
    },
    "lengthErr:$[1]:$[2]:$[3]": {
    	"us": "$[1] length must be between $[2] and $[3]"
    },
    "fldEmail": {
    	"us": "E-mail"
    },
    "fldPassword": {
    	"us": "Password"
    },
    "userNotFoundErr": {
    	"us": "We couldn't find a matching account."
    },
    "userOrPasswordInvalidErr": {
    	"us": "E-mail address or password is not correct."
    },
    "loginFailedErr": {
    	"us": "We couldn't verify your account."
    },
    "refreshTokenMissingErr": {
    	"us": "Something is wrong. Please try to logout and login again."
    },
    "accessTokenRenewFailErr": {
    	"us": "Your session has expired. Please login again."
    },
    "refreshTokenGenerationFailErr": {
    	"us": "We're experincing an issue while trying to log you in. Please contact support."
    },
    "refreshTokenNotFoundErr": {
    	"us": "It seems your session is no longer valid. Please sign in again."
    },
    "userNotAuthenticatedErr": {
    	"us": "You need to be signed in to access this service."
    }
});

//set default language
myLocalize.setLocale(configs.Settings.defaultLanguage);

// make this available to our users in our Node applications
module.exports = myLocalize;
// documentation: https://www.npmjs.com/package/localize

