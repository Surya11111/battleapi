var fs = require('fs');
var csv = require("fast-csv");
var Battle = require("../models/battle.js");
module.exports = function(options,cb) {
   console.log("=====inside Read=====");
    console.log("filepath",options.filepath);
   let stream= fs.createReadStream(options.filepath);
   var battles = [];
   csv.fromStream(stream, {headers : true})
       .on("data", function(row){
          battles.push(row);
        //  console.log(row);
         })
       .on("end", function(){
           console.log("====file reading done====");
          Battle.create(battles, function(err, documents) {
          if (err){
            console.error(err);
            cb(err);
          } else {
          console.log("Multiple documents inserted to Collection");
            cb(null);
          }
          });

        })
        .on('error', function(err) {
          cb(err);
       });
     };
