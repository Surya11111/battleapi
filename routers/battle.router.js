const router = require("express").Router();
var controller =  require("../api/core/battle.controller.js");
router.get("/battles",controller.getAllBattles);
router.get("/list",controller.list);
router.get("/count",controller.count);
router.get("/stats",controller.stats);
router.get("/search",controller.search);
exports=module.exports = router;
