const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const attendctrl = require('../../controllers/superadmin/attendancestudent/save');
const listctrl = require('../../controllers/superadmin/attendancestudent/list');

router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/save', helper.authenticateToken, attendctrl.save);
module.exports = router
