const express = require('express');
const router = express.Router();
const helper = require('../../utilities/helper');
const multer = require('../../utilities/multer');
const uploadsaveCtrl = require('../../controllers/admin/upload/upload');
router.post('/upload', helper.authenticateToken, multer.single('file'), uploadsaveCtrl.upload);
module.exports = router;






