var controller =  {};
var User =  require("../../models/user.js");
controller.setUpUser = function(req,res) {
    //let user = {name: 'bob',password: 'bob123',admin: true}
    console.log("user details: ",req.body);
    let user = new User(req.body);
    user.save(function(err) {
      if (err) {
         res.status(400).json({ succes: false });
      }
      console.log('User saved successfully');
       res.status(201).json({ success: true });
    });

}


 exports = module.exports = controller;
