var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const holidaymodel = require('../../../models/holiday.model');
const responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'holiday', 'View');
            if (havepermissions) {
                let holiday = await primary.model(constants.supermodel.holiday, holidaymodel).find({ holidaytitle: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('Holiday list...', holiday, res);
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
exports.withpagination = async (req, res) => {
    const { page, limit } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        const primary1 = mongoconnection.useDb(req.token.database);
        let branchdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branchdata && branchdata != null && branchdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branchdata.roleid, 'section', 'View');
            if (havepermissions) {
                primary.model(constants.supermodel.holiday, holidaymodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((branchdata) => {
                    return responsemanager.onSuccess('Holiday Data...', branchdata, res);
                }).catch((error) => {
                    return responsemanager.onError(error, res);
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
