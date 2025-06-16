var express = require('express');
var router = express.Router();
const helper = require('../../utilities/helper');
const saveCtrl = require('../../controllers/admin/role/save');
const getpermissionCtrl = require('../../controllers/admin/role/getpermission');
const rolelistctrl = require('../../controllers/admin/role/list');
const withpagination = require('../../controllers/admin/role/list');
const changestatus = require('../../controllers/admin/role/statuschange');

router.post('/save', helper.authenticateToken, saveCtrl.save);
router.get('/getpermission', getpermissionCtrl.getpermission);
router.get('/rolelist', helper.authenticateToken, rolelistctrl.rolelist);
router.get('/withpagination', helper.authenticateToken, withpagination.withpagination);
router.post('/changestatus', helper.authenticateToken, changestatus.changestatuss);
module.exports = router;