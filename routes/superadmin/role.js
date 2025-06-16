var express = require('express');
var router = express.Router();
const helper = require('../../utilities/helper');
const saveCtrl = require('../../controllers/superadmin/role/save');
const getpermissionCtrl = require('../../controllers/superadmin/role/getpermission');
// const rolelistctrl = require('../../controllers/admin/role/list');

router.get('/getpermission', getpermissionCtrl.getpermission);
router.post('/save', helper.authenticateToken, saveCtrl.save);
module.exports = router;