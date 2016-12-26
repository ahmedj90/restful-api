'use strict';

var FileStreamRotator = require('file-stream-rotator');  //used for morgan to create log file everyday
var fs = require('fs');   //file system

var logDirectory = __dirname + '/../log';

// create log folder if it does not exist
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream 
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});


module.exports = {
    accessLogStream : accessLogStream
};