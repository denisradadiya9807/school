const express = require('express');
const router = express.Router();
const adminmodel = require('../../../models/admin.model');
const classmodel = require('../../../models/class.model');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const constants = require('../../../utilities/constants');
const mongoConnection = require('../../../utilities/conection');
const mongoose = require('mongoose');

exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let data = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId);
        if (data && data != null && data.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, data.roleid, 'class', 'View');
            if (havepermissions) {
                let classs = await primary.model(constants.supermodel.class, classmodel).find({ classname: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('class data list ...', classs, res);
            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
}
exports.withpaginate = async (req, res) => {
    const { page, limit } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let data = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId);
        if (data && data != null && data.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, data.roleid, 'class', 'View');
            if (havepermissions) {
                primary.model(constants.supermodel.class, classmodel).paginate({}, {
                    page,
                    limit,
                    sort: { _id: -1 },
                    lean: true
                }).then((data1) => {
                    return responsemanager.onSuccess('class data list ...', data1, res);
                })

            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
}