var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');
const savelead = require('../../controllers/admin/lead/save');
const listlead = require('../../controllers/admin/lead/list');
const deletelead = require('../../controllers/admin/lead/delete');
const getonelead = require('../../controllers/admin/lead/getone');

router.post('/save', helper.authenticateToken, savelead.save);
router.post('/list', helper.authenticateToken, listlead.list);
router.post('/delete', helper.authenticateToken, deletelead.delete);
router.post('/getone', helper.authenticateToken, getonelead.getone);
module.exports = router;