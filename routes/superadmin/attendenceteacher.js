const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const attendance = require('../../controllers/superadmin/attendenceteacher/save');

router.post('/save', helper.authenticateToken, attendance.save);

module.exports = router;