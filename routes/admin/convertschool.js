var express = require('express');
var router = express.Router();
var helper = require('../../utilities/helper');
const savelead = require('../../controllers/admin/convertschool/convert');

router.post('/convert', helper.authenticateToken, savelead.convert);
module.exports = router;