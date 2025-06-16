var express = require('express');
var router = express.Router();
const helper = require('../../utilities/helper');
const loginCtrl = require('../../controllers/admin/auth/login');
router.post('/login', helper.authenticateToken, loginCtrl.login);
module.exports = router;