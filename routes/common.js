var express = require('express');
var router = express.Router();
 
var exports ={};

exports.jsonResponse = function (Response, HttpStateCode, isRequestSucceeded, messages=null, data=null){
  return Response.status(HttpStateCode).json({"success": isRequestSucceeded,
                                              "messages": messages,
                                              "data": data });
}

module.exports = exports;