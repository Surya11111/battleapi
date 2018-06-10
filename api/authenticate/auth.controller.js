var jwt =require('jsonwebtoken');
var User =  require("../../models/user.js");
var controller =  {};
const config = require("../../config/config");
controller.authenticate = function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) {

      res.status(500).json({message:"error"});
    }

    if (!user) {
       res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
        if (user.password != req.body.password) {
         res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
         const payload = {
         admin: user.admin,
         name :user.name
         };
        var token = jwt.sign(payload,config.secret, {
          expiresIn:"1h"}) // expires in 1 hours

        // return the information including token as JSON
        res.status(200).json({
          success: true,
          message: 'jwt token created!',
          token: token
        });
       }
    }
    })
};
 exports = module.exports = controller;
