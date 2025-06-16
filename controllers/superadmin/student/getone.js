var express = require('express');
var router = express.Router();
var constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
var responseManager = require('../../../utilities/response.manager');
const mongoConnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var studentmodel = require('../../../models/student.model');
exports.getone = async (req, res) => {
    const { studentid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoConnection.useDb(req.token.database);
        const primary = mongoConnection.useDb(constant.schoolsuperadmin);
        let adminData = await primary1.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getsuperadminPermission(req, adminData.roleid, 'student', 'View');
            if (getpermission) {
                const Studentdata = await primary.model(constant.supermodel.student, studentmodel).findOne({ _id: new mongoose.Types.ObjectId(studentid) }).lean();
                if (Studentdata) {
                    return responseManager.onSuccess('lead data victrive succeefully...', Studentdata, res);
                } else {
                    return responseManager.onBadRequest({ message: 'invalid studentid' }, res);
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