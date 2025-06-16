var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const schoolbranchesModel = require('../../../models/schoolbranches.model');

exports.delete = async (req, res) => {
    const { branchid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongoConnection.useDb(req.token.database);
        let branch = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'schoolbranch', 'Delete');
            if (havepermissions) {
                let branchdelete = await primary.model(constants.Model.schoolbranch, schoolbranchesModel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (branchdelete) {
                    return responsemanager.onSuccess('Branch Delete Successfully...', branchdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'invalid branchid' }, res);
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