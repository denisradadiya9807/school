const express = require('express');
const router = express.Router();
const savectrl = require('../../controllers/superadmin/notice/save');
const listctrl = require('../../controllers/superadmin/notice/list');
const deletectrl = require('../../controllers/superadmin/notice/delete');
const helper = require('../../utilities/helper');

router.post('/save', helper.authenticateToken, savectrl.save);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/withpaginate', helper.authenticateToken, listctrl.list);

module.exports = router;