var express = require('express');
var router = express.Router();
var constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
var responseManager = require('../../../utilities/response.manager');
const mongoConnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var leadmodel = require('../../../models/lead.model');
exports.getone = async (req, res) => {
    const { leadid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoConnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'lead', 'View');
            if (getpermission) {
                const leaddata = await primary.model(constant.Model.lead, leadmodel).findById({ _id: new mongoose.Types.ObjectId(leadid) }).lean();
                if (leaddata) {
                    return responseManager.onSuccess('lead data victrive succeefully...', leaddata, res);
                } else {
                    return responseManager.onBadRequest({ message: 'invalid leadid' }, res);
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
};