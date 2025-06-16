var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const schoolbranchmodel = require('../../../models/schoolbranches.model');
const responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(req.token.database);
        let academicdata = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'schoolbranch', 'View');
            if (havepermissions) {
                let branch = await primary.model(constants.Model.schoolbranch, schoolbranchmodel).find({ branchname: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('Brach list...', branch, res);
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
        const primary = mongoconnection.useDb(req.token.database);
        let branchdata = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branchdata && branchdata != null && branchdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branchdata.roleid, 'schoolbranch', 'View');
            if (havepermissions) {
                primary.model(constants.Model.schoolbranch, schoolbranchmodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((branchdata) => {
                    return responsemanager.onSuccess('Branch Data...', branchdata, res);
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
