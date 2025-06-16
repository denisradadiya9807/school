var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const standardmodel = require('../../../models/standard.model');
exports.delete = async (req, res) => {
    const { standardid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'standard', 'Delete');
            if (havepermissions) {
                if (standardname && standardname != '' && standardname != null && standardname != undefined) {
                    if (fees && fees != '' && fees != null && fees != undefined) {
                        let branchdelete = await primary.model(constants.supermodel.standard, standardmodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(standardid) }).lean();
                        if (branchdelete) {
                            return responsemanager.onSuccess('standard Delete Successfully...', branchdelete, res);
                        } else {
                            return responsemanager.onBadRequest({ message: 'invalid standardid' }, res);
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'fees field is require' }, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'standardis require...' }, res);
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