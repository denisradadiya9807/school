const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const savectrl = require('../../controllers/superadmin/exam/save');
const withpaginatectrl = require('../../controllers/superadmin/exam/list');
// const statusctrl = require('../../controllers/superadmin/exam/status');
const listctrl = require('../../controllers/superadmin/exam/list');

router.post('/list', helper.authenticateToken, listctrl.list);
// router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/withpaginate', helper.authenticateToken, withpaginatectrl.withpagination);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;