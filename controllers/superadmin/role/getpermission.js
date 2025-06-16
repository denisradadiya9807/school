var express = require('express');
var router = express.Router();
const async = require('async');
const config = require('../../../utilities/config');
exports.getpermission = async (req, res) => {
    let finalpermission = [];
    async.forEach(config.getsuperadmincollection, (Permissions, next_permission) => {
        let obj = {
            displayname: Permissions.text,
            collectionname: Permissions.value,
            insertupdate: false,
            Delete: false,
            View: false
        };
        finalpermission.push(obj);
        next_permission();
    }, () => {
        res.status(200).json({
            message: 'final permission : !',
            data: finalpermission
        });
    })
};