var express = require('express');
var router = express.Router();
var constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
var responseManager = require('../../../utilities/response.manager');
const mongoConnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var teachermodel = require('../../../models/teacher.model');
exports.getone = async (req, res) => {
    const { teacherid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoConnection.useDb(req.token.database);
        const primary = mongoConnection.useDb(constant.schoolsuperadmin);
        let adminData = await primary1.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getsuperadminPermission(req, adminData.roleid, 'teacher', 'View');
            if (getpermission) {
                const teacherdata = await primary.model(constant.supermodel.teacher, teachermodel).findOne({ _id: new mongoose.Types.ObjectId(teacherid) }).lean();
                if (teacherdata) {
                    return responseManager.onSuccess('Teacher data victrive succeefully...', teacherdata, res);
                } else {
                    return responseManager.onBadRequest({ message: 'invalid teacherid' }, res);
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