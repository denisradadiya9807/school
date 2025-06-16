var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');
var multer = require('../../utilities/multer');

var savectrl = require('../../controllers/superadmin/teacher/save');
var listctrl = require('../../controllers/superadmin/teacher/list');
var withpaginate = require('../../controllers/superadmin/teacher/list');
var deletectrl = require('../../controllers/superadmin/teacher/delete');
var getonectrl = require('../../controllers/superadmin/teacher/getone');
var statusctrl = require('../../controllers/superadmin/teacher/status');
router.post('/save', helper.authenticateToken, multer.single('Teacherphoto'), savectrl.save);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/withpaginate', helper.authenticateToken, withpaginate.withpaginate);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/getone', helper.authenticateToken, getonectrl.getone);
router.post('/status', helper.authenticateToken, statusctrl.status);
module.exports = router; 