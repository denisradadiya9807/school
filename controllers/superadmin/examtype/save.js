var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var config = require('../../../utilities/config');
var responsemanager = require('../../../utilities/response.manager');
var mongooconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const adminmodel = require('../../../models/admin.model');
const examtypemodel = require('../../../models/examtype.model');
const schoolbranchmodel = require('../../../models/schoolbranches.model');
exports.save = async (req, res) => {
    const { ExamType, status, examtypeid, branchid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        // console.log(" Valid token and adminId", req.token.adminId);
        let primary1 = mongooconnection.useDb(req.token.database);
        let primary = mongooconnection.useDb(constants.schoolsuperadmin);
        //  console.log("Using database:", req.token.database);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        //    console.log("Branch (admin) fetched from DB:", branch);
        if (branch && branch != null && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'examtype', 'insertupdate');
            if (havepermissions) {
                const existing = await primary.model(constants.supermodel.examtype, examtypemodel).findOne({ ExamType: ExamType }).lean();
                if (existing) {
                    return responsemanager.onBadRequest({ message: 'ExamType is Already exiting' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(branchid)) {
                    return responsemanager.onBadRequest({ message: 'Invalid branch ID' }, res);
                }
                let branch = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (!branch) {
                    return responsemanager.onBadRequest({ message: 'branch is not valid' }, res);
                }
                let obj = {
                    ExamType: ExamType,
                    status: true,
                    branchid: branchid
                };
                if (examtypeid) {
                    let examtypeupdate = await primary.model(constants.supermodel.examtype, examtypemodel)
                        .findOneAndUpdate(
                            { _id: new mongoose.Types.ObjectId(examtypeid) },
                            obj,
                            { new: true }
                        );
                    return responsemanager.onSuccess({ message: 'Exam Type updated successfully...' }, examtypeupdate, res);
                } else {
                    let examtype = await primary.model(constants.supermodel.examtype, examtypemodel).create(obj);
                    return responsemanager.onSuccess('ExamType Create Successfully...', examtype, res);
                }
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
