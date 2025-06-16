var express = require('express');
var router = express.Router();
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const sectionmodel = require('../../../models/section.model');
const responseManager = require('../../../utilities/response.manager');
const mongoose = require('mongoose');
const constants = require('../../../utilities/constants');
exports.status = async (req, res) => {
    const { sectionid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let branchdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branchdata && branchdata != null && branchdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branchdata.roleid, 'schoolbranch', 'View');
            if (havepermissions) {
                let branch = await primary.model(constants.supermodel.section, sectionmodel).findById({ _id: new mongoose.Types.ObjectId(sectionid) });
                let obj = {
                    status: (branch && branch.status === true) ? false : true
                }
                let changestatus = await primary.model(constants.supermodel.section, sectionmodel).findByIdAndUpdate(sectionid, obj);
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
