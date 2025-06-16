var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var adminmodel = require('../../../models/admin.model');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
var responsemanager = require('../../../utilities/response.manager');
const mongoconection = require('../../../utilities/conection');
const timetablemodel = require('../../../models/timetable.model');
const timetable = require('../../../models/timetable.model');

exports.delete = async (req, res) => {
    const { timetableid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconection.useDb(req.token.database);
        let primary = mongoconection.useDb(constants.schoolsuperadmin);
        let admin = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admin && admin != '' && admin.status === true) {
            let havepermission = await config.getsuperadminPermission(req, admin.roleid, 'timetable', 'Delete');
            if (havepermission) {
                if (!mongoose.Types.ObjectId.isValid(timetableid)) {
                    return responsemanager.onBadRequest({ message: 'Check Id...' }, res);
                }
                let deleteteacher = await primary.model(constants.supermodel.timetable, timetablemodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(timetableid) }).lean();
                if (deleteteacher) {
                    return responsemanager.onSuccess('teacher Delete Data Successfully...', deleteteacher, res);
                }
                return responsemanager.onBadRequest({ message: 'Please Check teacher Id...' }, res);

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
