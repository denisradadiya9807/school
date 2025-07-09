const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const savectrl = require('../../controllers/superadmin/examtype/save');
const withpaginatectrl = require('../../controllers/superadmin/examtype/list');
const statusctrl = require('../../controllers/superadmin/examtype/status');
const listctrl = require('../../controllers/superadmin/examtype/list');

router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/withpaginate', helper.authenticateToken, withpaginatectrl.withpagination);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;