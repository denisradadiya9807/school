var express = require('express');
var router = express.Router();

const loginctrl = require('../../controllers/superadmin/auth/login');
router.post('/login', loginctrl.login);
module.exports = router;
