var express = require('express');
var router = express.Router();
const helper = require('../../utilities/helper');
const savectrl = require('../../controllers/superadmin/addacademicyear/save');
const paginatectrl = require('../../controllers/superadmin/addacademicyear/list');
const listctrl = require('../../controllers/superadmin/addacademicyear/list');
const deletectrl = require('../../controllers/superadmin/addacademicyear/delete');
const statusctrl = require('../../controllers/superadmin/addacademicyear/status');

router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/paginate', helper.authenticateToken, paginatectrl.withpagination);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router;
