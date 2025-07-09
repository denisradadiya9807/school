const express = require('express');
const router = express.Router();
const getfeesctrl = require('../../controllers/superadmin/fees/getfeesdate');
const helper = require('../../utilities/helper');

router.post('/getdate', helper.authenticateToken, getfeesctrl.withoutPagination);
module.exports = router;
