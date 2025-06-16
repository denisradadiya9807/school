var express = require('express');
var router = express.Router();
var mongoConnection = require('../../../utilities/conection');
var academicmodel = require('../../../models/addacademicyear.model');
var adminmodel = require('../../../models/admin.model');
const config = require('../../../utilities/config');
const responsemanager = require('../../../utilities/response.manager');
const constants = require('../../../utilities/constants');
const mongoose = require('mongoose');

exports.delete = async (req, res) => {
    const { academicid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoConnection.useDb(req.token.database);
        const primary = mongoConnection.useDb(constants.schoolsuperadmin);          
        let academic = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academic && academic != null && academic.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academic.roleid, 'academicyear', 'Delete');
            if (havepermissions) {
                let academicdelete = await primary.model(constants.supermodel.academicyear, academicmodel).findByIdAndDelete({ _id: new mongoose.Types.ObjectId(academicid) }).lean();
                if (academicdelete) {
                    return responsemanager.onSuccess('Acadmic Year Delete successfully...', academicdelete, res);
                } else {
                    return responsemanager.onBadRequest({ message: 'Invalid Academicyearid.' }, res);
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