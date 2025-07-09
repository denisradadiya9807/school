var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const exammodel = require('../../../models/exam.model');
const responsemanager = require('../../../utilities/response.manager');
const examtypemodel = require('../../../models/examtype.model');
exports.list = async (req, res) => {
    const { search, ExamType } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'exam', 'View');
            if (havepermissions) {
                let examtype = await primary.model(constants.supermodel.examtype, examtypemodel)
                    .findOne({ ExamType: ExamType }).lean();
                if (!examtype) {
                    return responsemanager.onBadRequest({ message: 'Exam type not found' }, res);
                }
                let exam = await primary.model(constants.supermodel.exam, exammodel).find({ examtype: examtype._id, examtype: { '$regex': new RegExp(search, "i") }, });
                return responsemanager.onSuccess('Exam list...', exam, res);
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
            let havepermissions = await config.getsuperadminPermission(req, branchdata.roleid, 'exam', 'View');
            if (havepermissions) {
                primary.model(constants.supermodel.exam, exammodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((exam) => {
                    return responsemanager.onSuccess('Exam Data...', exam, res);
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
