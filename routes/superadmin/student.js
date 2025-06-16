var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');
const multer = require('../../utilities/multer');
const savectrl = require('../../controllers/superadmin/student/save');
const deletectrl = require('../../controllers/superadmin/student/delete');
const listctrl = require('../../controllers/superadmin/student/list');
const paginatectrl = require('../../controllers/superadmin/student/list');
const statusctrl = require('../../controllers/superadmin/student/status');
const uploadctrl = require('../../controllers/superadmin/student/upload');
const getonectrl = require('../../controllers/superadmin/student/getone');

router.post('/upload', helper.authenticateToken, multer.single('Photo'), uploadctrl.upload);
router.post('/status', helper.authenticateToken, statusctrl.status);
router.post('/getone', helper.authenticateToken, getonectrl.getone);
router.post('/withpaginate', helper.authenticateToken, paginatectrl.withpaginate);
router.post('/list', helper.authenticateToken, listctrl.list);
router.post('/delete', helper.authenticateToken, deletectrl.delete);
router.post('/save', helper.authenticateToken, savectrl.save);
module.exports = router