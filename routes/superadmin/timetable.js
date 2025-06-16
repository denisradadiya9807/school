const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');

const savectrl = require('../../controllers/superadmin/timetable/save');
router.post('/save', helper.authenticateToken, savectrl.save);
const timetabelctrl = require('../../controllers/superadmin/timetable/delete');
router.post('/delete', helper.authenticateToken, timetabelctrl.delete);
const listctrl = require('../../controllers/superadmin/timetable/list');
router.post('/list', helper.authenticateToken, listctrl.list);

module.exports = router
