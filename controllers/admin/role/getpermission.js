var express = require('express');
var router = express.Router();
const async = require('async');
const mongoose = require('mongoose');
const constants = require('../../../utilities/constants');
const config = require('../../../utilities/config');
const mongoConection = require('../../../utilities/conection');
const responseManager = require('../../../utilities/response.manager');
const helper = require('../../../utilities/helper');
const rolemodel = require('../../../models/role.model');
const permissionmodel = require('../../../models/permission.model');
// const { Collection } = require('mongoose');

exports.getpermission = async (req, res) => {
    let finalpermission = [];
    async.forEach(config.getadmincollection, (Permissions, next_permission) => {
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
            message: 'final permission :!',
            data: finalpermission
        });
    })
};