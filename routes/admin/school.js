var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');
const saveschool = require('../../controllers/admin/school/save');
const listschool = require('../../controllers/admin/school/list');
const deleteschool = require('../../controllers/admin/school/delete');
const getoneschool = require('../../controllers/admin/school/getone');
const changestatus = require('../../controllers/admin/school/change');

router.post('/save', helper.authenticateToken, saveschool.save);
router.post('/list', helper.authenticateToken, listschool.list);
router.post('/delete', helper.authenticateToken, deleteschool.delete);
router.post('/getone', helper.authenticateToken, getoneschool.getone);
router.post('/changestatus', helper.authenticateToken, changestatus.change);
module.exports = router;