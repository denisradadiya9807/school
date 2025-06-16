var express = require('express');
var router = express.Router();
var constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
var responseManager = require('../../../utilities/response.manager');
const mongoConnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var schoolmodel = require('../../../models/school.model');
exports.getone = async (req, res) => {
    const { schoolid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoConnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'school', 'View');
            if (getpermission) {
                const schooldata = await primary.model(constant.Model.school, schoolmodel).findById({ _id: new mongoose.Types.ObjectId(schoolid) }).lean();
                if (schooldata) {
                    return responseManager.onSuccess('school data victrive succeefully...', schooldata, res);
                } else {
                    return responseManager.onBadRequest({ message: 'invalid schoolid' }, res);
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
};