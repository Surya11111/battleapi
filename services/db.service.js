var mongoose = require("mongoose");

module.exports = function (config,cb) {
mongoose.connect(config.mongoUrl);
mongoose.Promise = global.Promise;
var connection = mongoose.connection;
 connection.once('open', function() {
   console.log('Mongoose connection open to: ' + config.mongoUrl);
    cb(null);
 });

 connection.on('error', function() {
   console.error('Mongoose connection error: ' + config.mongoUrl);
    cb(new Error('Mongoose connection error'));
 });

 process.on('SIGINT', function() {
   mongoose.connection.close(function() {
     console.log('Mongoose connection disconnected due to app SIGINT.');
   });

 });
}
