const express = require('express');
const router = express.Router();
const helper = require('../../../utilities/helper');
const constant = require('../../../utilities/constants');
const mongoConnection = require('../../../utilities/conection');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const leadmodel = require('../../../models/lead.model');
const mongoose = require('mongoose');
const responseManager = require('../../../utilities/response.manager');
const constants = require('../../../utilities/constants');
exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoConnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'lead', 'View');
            if (getpermission) {
                let leaddata = await primary.model(constant.Model.lead, leadmodel).find({ schoolname: { '$regex': new RegExp(search, "i") }, }).lean();
                return responseManager.onSuccess('lead list...', leaddata, res);
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

