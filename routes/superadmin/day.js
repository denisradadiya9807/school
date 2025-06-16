var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');

const savectrl = require('../../controllers/superadmin/day/save');
const deletectrl = require('../../controllers/superadmin/day/delete');
const paginatectrl = require('../../controllers/superadmin/day/list');
const listctrl = require('../../controllers/superadmin/day/list');
const statusctrl = require('../../controllers/superadmin/day/status');
router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/paginate', helper.authenticateToken, paginatectrl.withpagination);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;