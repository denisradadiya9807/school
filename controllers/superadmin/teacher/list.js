var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var adminmodel = require('../../../models/admin.model');
var teachermodel = require('../../../models/teacher.model');
var mongoose = require('mongoose');
var responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'teacher', 'View');
            if (havepermissions) {
                let teacher = await primary.model(constants.supermodel.teacher, teachermodel).find({ Teachername: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('Brach list...', teacher, res);
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
    const { page, limit, classname, section, teacher_Gender } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        const primary1 = mongoconnection.useDb(req.token.database);
        let teacherdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (teacherdata && teacherdata != null && teacherdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, teacherdata.roleid, 'teacher', 'View');
            if (havepermissions) {
                primary.model(constants.supermodel.teacher, teachermodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((teacherdata) => {
                    return responsemanager.onSuccess('Branch Data...', teacherdata, res);
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