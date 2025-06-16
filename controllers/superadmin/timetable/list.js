var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var adminmodel = require('../../../models/admin.model');
var timetablemodel = require('../../../models/timetable.model');
var mongoose = require('mongoose');
var responsemanager = require('../../../utilities/response.manager');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'timetable', 'View');
            if (havepermissions) {
                let timetable = await primary.model(constants.supermodel.timetable, timetablemodel).find({});
                return responsemanager.onSuccess('Brach list...', timetable, res);
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
