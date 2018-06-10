var express = require('express');
var app = express();
var async = require("async");
var connectToDb = require("./services/db.service");
const config = require("./config/config");
//var cors = require('cors');
var server = require('http').createServer(app)
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors());

//app.set('secret',config.secret);

connectToDb(config,function(err){
   if(!err){
     console.log("database connected");
   }
});


app.use('/api/v1/battleapis', require('./router'));
exports = module.exports = server;
