var express = require('express');
var router = express.Router();
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const schoolbranchmodel = require('../../../models/schoolbranches.model');
const responseManager = require('../../../utilities/response.manager');
const mongoose = require('mongoose');
const mongoconection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
exports.status = async (req, res) => {
    const { branchid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(req.token.database);
        let branchdata = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branchdata && branchdata != null && branchdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branchdata.roleid, 'schoolbranch', 'View');
            if (havepermissions) {
                let branch = await primary.model(constants.Model.schoolbranch, schoolbranchmodel).findById({ _id: new mongoose.Types.ObjectId(branchid) });
                let obj = {
                    status: (branch && branch.status === true) ? false : true
                }
                let changestatus = await primary.model(constants.Model.schoolbranch, schoolbranchmodel).findByIdAndUpdate(branchid, obj);
                return responseManager.onSuccess('Status Change Successfully...', changestatus, res);

            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
}
