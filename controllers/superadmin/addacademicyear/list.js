var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const schoolmodel = -require('../../../models/school.model');
const academicmodel = require('../../../models/addacademicyear.model');
const responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin)
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'academicyear', 'View');
            if (havepermissions) {
                let academic = await primary.model(constants.supermodel.academicyear, academicmodel).find({ academicyear: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('role list...', academic, res);
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
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'academicyear', 'View');
            if (havepermissions) {
                primary.model(constants.supermodel.academicyear, academicmodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((roleData) => {
                    return responsemanager.onSuccess('Role Data...', roleData, res);
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
