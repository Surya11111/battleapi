const router = require("express").Router();
var controller =  require("../api/setup/user.controller.js");
router.post("/user",controller.setUpUser);
exports=module.exports = router;
