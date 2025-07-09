const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const feestype = require('../../controllers/superadmin/feestype/list');

router.post('/list', helper.authenticateToken, feestype.list)
module.exports = router;