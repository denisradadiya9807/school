var express = require('express');
var router = express.Router();
var constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
var responseManager = require('../../../utilities/response.manager');
const mongoConnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var schoolmodel = require('../../../models/school.model');
exports.delete = async (req, res) => {
    const { schoolid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoConnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'school', 'Delete');
            if (getpermission) {
                const schooldelete = await primary.model(constant.Model.school, schoolmodel).findByIdAndDelete({ _id: new mongoose.Types.ObjectId(schoolid) }).lean();
                if (schooldelete) {
                    return responseManager.onSuccess('school delete succeefully...', schooldelete, res);
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