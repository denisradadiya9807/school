var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const semestermodel = require('../../../models/semester.model');
exports.delete = async (req, res) => {
    const { semesterid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'semester', 'Delete');
            if (havepermissions) {
                let branchdelete = await primary.model(constants.supermodel.semester, semestermodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(semesterid) }).lean();
                if (branchdelete) {
                    return responsemanager.onSuccess('semester Delete Successfully...', branchdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'invalid semesterid' }, res);
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