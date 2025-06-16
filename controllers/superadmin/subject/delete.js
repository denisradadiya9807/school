var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var constants = require('../../../utilities/constants');
var mongoConnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const subjectmodel = require('../../../models/subject.model');
exports.delete = async (req, res) => {
    const { subjectid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let primary = mongoConnection.useDb(constants.schoolsuperadmin);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != '' && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'section', 'Delete');
            if (havepermissions) {
                let subjectdelete = await primary.model(constants.supermodel.subject, subjectmodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(subjectid) }).lean();
                if (subjectdelete) {
                    return responsemanager.onSuccess('section Delete Successfully...', subjectdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'invalid subjectid' }, res);
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