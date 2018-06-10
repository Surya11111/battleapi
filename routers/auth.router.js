const router = require("express").Router();
var controller =  require("../api/authenticate/auth.controller.js");
router.post("/",controller.authenticate);
exports=module.exports = router;
