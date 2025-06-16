var express = require('express');
var router = express.Router();
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const academicmodel = require('../../../models/addacademicyear.model');
const responseManager = require('../../../utilities/response.manager');
const mongoose = require('mongoose');
const mongoconection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
exports.status = async (req, res) => {
    const { academicid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'academicyear', 'View');
            if (havepermissions) {
                let academic = await primary.model(constants.supermodel.academicyear, academicmodel).findById({ _id: new mongoose.Types.ObjectId(academicid) });
                let obj = {
                    status: (academic && academic.status === true) ? false : true
                }
                let changestatus = await primary.model(constants.supermodel.academicyear, academicmodel).findByIdAndUpdate(academicid, obj);
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
