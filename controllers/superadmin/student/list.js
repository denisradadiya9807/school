var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var adminmodel = require('../../../models/admin.model');
var studentmodel = require('../../../models/student.model');
var mongoose = require('mongoose');
var responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'student', 'View');
            if (havepermissions) {
                let student = await primary.model(constants.supermodel.student, studentmodel).find({ Student_Name: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('Brach list...', student, res);
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
    const { page, limit, classname, section, Student_Gender } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        const primary1 = mongoconnection.useDb(req.token.database);
        let Studentdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (Studentdata && Studentdata != null && Studentdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, Studentdata.roleid, 'student', 'View');
            if (havepermissions) {
                let filter = {};
                if (classname && classname.trim() !== '') {
                    filter.classname = classname;
                }
                if (section && section.trim() !== '') {
                    filter.section = section;
                }
                if (Student_Gender && Student_Gender.trim() !== '') {
                    filter.Student_Gender = Student_Gender;
                }
                primary.model(constants.supermodel.student, studentmodel).paginate(filter, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((Studentdata) => {
                    return responsemanager.onSuccess('Branch Data...', Studentdata, res);
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