var express = require('express');
var router = express.Router();
const helper = require('../../utilities/helper');
const savectrl = require('../../controllers/superadmin/addbranch/save');
const deletectrl = require('../../controllers/superadmin/addbranch/delete');
const paginatectrl = require('../../controllers/superadmin/addbranch/list');
const listctrl = require('../../controllers/superadmin/addbranch/list');
const statuschangectrl = require('../../controllers/superadmin/addbranch/status');

router.post('/status', helper.authenticateToken, statuschangectrl.status);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/paginate', helper.authenticateToken, paginatectrl.withpagination);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;    