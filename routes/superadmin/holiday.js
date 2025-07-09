const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const holidaysave = require('../../controllers/superadmin/holiday/save');
const holidaylist = require('../../controllers/superadmin/holiday/list');
const holidaylists = require('../../controllers/superadmin/holiday/list');

router.post('/list', helper.authenticateToken, holidaylist.list);
router.post('/withpaginate', helper.authenticateToken, holidaylists.withpagination);
router.post('/save', helper.authenticateToken, holidaysave.save);

module.exports = router;