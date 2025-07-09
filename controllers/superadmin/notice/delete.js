const express = require('express');
const router = express.Router();
const adminmodel = require('../../../models/admin.model');
const responcemanager = require('../../../utilities/response.manager');
const mongoconection = require('../../../utilities/conection');
const config = require('../../../utilities/config');
const noticemodel = require('../../../models/notice.model');
const { default: mongoose } = require('mongoose');
const constants = require('../../../utilities/constants')

exports.delete = async (req, res) => {
    const { noticeid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconection.useDb(req.token.database);
        let primary = mongoconection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId);
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'notice', 'Delete');
            if (havepermissions) {
                let deletenotice = await primary.model(constants.supermodel.notice, noticemodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(noticeid) })
                return responcemanager.onSuccess('Notice Delete Successfully...', deletenotice, res);
            } else {
                return responcemanager.accessdenied(res);
            }
        } else {
            return responcemanager.unauthorisedRequest(res);
        }
    } else {
        return responcemanager.unauthorisedRequest(res);
    }
}