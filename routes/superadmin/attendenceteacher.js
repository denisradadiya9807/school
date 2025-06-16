const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const attendance = require('../../controllers/superadmin/attendenceteacher/save');
const attendancelist = require('../../controllers/superadmin/attendenceteacher/list');

router.post('/list', helper.authenticateToken, attendancelist.list);
router.post('/save', helper.authenticateToken, attendance.save);

module.exports = router;    