const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const savectrl = require('../../controllers/superadmin/class/save');
const deletectrl = require('../../controllers/superadmin/class/delete');
const withpaginatectrl = require('../../controllers/superadmin/class/list');
const listctrl = require('../../controllers/superadmin/class/list');
const statusctrl = require('../../controllers/superadmin/class/status');

router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/withpaginate', helper.authenticateToken, withpaginatectrl.withpaginate);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;