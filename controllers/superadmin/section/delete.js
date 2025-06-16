var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const sectionmodel = require('../../../models/section.model');
exports.delete = async (req, res) => {
    const { sectionid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'section', 'Delete');
            if (havepermissions) {
                let branchdelete = await primary.model(constants.supermodel.section, sectionmodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(sectionid) }).lean();
                if (branchdelete) {
                    return responsemanager.onSuccess('section Delete Successfully...', branchdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'invalid sectionid' }, res);
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