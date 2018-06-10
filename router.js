/*
 routing file for each api module
*/
var authenticateMiddleware = require("./middleware/authenticate");
var router = require('express').Router();
router.use('/setup',require('./routers/user.setup.router'));
router.use('/authenticate',require('./routers/auth.router'));
router.use(authenticateMiddleware);
router.use('/core',require('./routers/battle.router'));
exports = module.exports = router;
