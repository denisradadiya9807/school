var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const mediummodel = require('../../../models/medium.model');
exports.delete = async (req, res) => {
    const { mediumid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'medium', 'Delete');
            if (havepermissions) {
                let branchdelete = await primary.model(constants.supermodel.medium, mediummodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(mediumid) }).lean();
                if (branchdelete) {
                    return responsemanager.onSuccess('medium Delete Successfully...', branchdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'invalid mediumid' }, res);
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