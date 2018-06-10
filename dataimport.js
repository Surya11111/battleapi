var mongoose = require("mongoose");
const config = require("./config/config");
var importcsvData = require("./util/importcsvdata");
mongoose.connect(config.mongoUrl);
mongoose.Promise = global.Promise;
var connection = mongoose.connection;
 connection.once('open', function() {
   console.log('Mongoose connection open to: ' + config.mongoUrl);
     importcsvData({filepath:__dirname+"/battles.csv"},function(err,data){
            if(!err){
              console.log("data imported succesfully");
              mongoose.connection.close(function() {
                console.log('Mongoose connection closed');
                  process.exit(0);
              });
            }
            else {
              console.log("data import failed",err);
            }
          });

  });

connection.on('error', function() {
   console.error('Mongoose connection error: ' + config.mongoUrl);

 });
 process.on('SIGINT', function() {
   mongoose.connection.close(function() {
     console.log('Mongoose connection disconnected due to app SIGINT.');
   });

 });
