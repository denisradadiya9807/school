var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');

const savectrl = require('../../controllers/superadmin/section/save');
const deletectrl = require('../../controllers/superadmin/section/delete');
const paginatectrl = require('../../controllers/superadmin/section/list');
const listctrl = require('../../controllers/superadmin/section/list');
const statusctrl = require('../../controllers/superadmin/section/status');
router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/paginate', helper.authenticateToken, paginatectrl.withpagination);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;