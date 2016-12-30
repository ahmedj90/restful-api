//Includes
//https://www.npmjs.com/package/validator
var validator = require('validator');
var localization = require('./localization');
var configs = require(__dirname + '/../configs');

var exports ={};


exports.isString = function(val, varName){	
	if(typeof val === 'string' || val instanceof String)
		return {valid: true};
	else
		return {valid: false, error: localization.translate("invalidDataTypeErr:$[1]", varName)};		
}

exports.isNotEmptyString = function(val, varName){
	if(val === null || val === undefined || validator.isEmpty(val))	//empty
		return {valid: false, error: localization.translate("emptyFieldErr:$[1]", varName)};			
	else	//full
		return {valid: true}; 
}

exports.isValidLengthString = function(val, varName, min, max){
	if(validator.isLength(val, {min: min, max: max}))	//within length
		return {valid: true}; 
	else	//out of limit
		return {valid: false, error: localization.translate("lengthErr:$[1]:$[2]:$[3]", varName, min, max)};			
}

exports.isEmail = function(email, varName){	
	var isNotEmptyVar = this.isNotEmptyString(email, varName);
	if(!isNotEmptyVar.valid){
		return isNotEmptyVar;
	}
	
	var isStringVar = this.isString(email, varName);
	if(!isStringVar.valid){
		return isStringVar;
	}

	var isValidLength = this.isValidLengthString(email, varName, 5, 50);
	if(!isValidLength.valid){
		return {valid: false, error: localization.translate("lengthErr:$[1]:$[2]:$[3]", varName, 5, 50)};	
	}

	var isEmailVar = validator.isEmail(email);
	if(!isEmailVar){
		return {valid: false, error: localization.translate("invalidFormatErr:$[1]", varName)};	
	}
	
	return {valid: true};
};

exports.isPassword = function(password, varName){	
	var isNotEmptyVar = this.isNotEmptyString(password, varName);	
	if(!isNotEmptyVar.valid){
		return isNotEmptyVar;
	}
	
	var isStringVar = this.isString(password, varName);
	if(!isStringVar.valid){
		return isStringVar;
	}

	var isValidLength = this.isValidLengthString(password, varName, configs.Settings.passwordSettings.minLength, configs.Settings.passwordSettings.maxLength);	
	if(!isValidLength.valid){
		return isValidLength;
	}
	
	return {valid: true};	
};


module.exports = exports;