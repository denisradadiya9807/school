var express = require('express');
var router = express.Router();
const async = require('async');
const constants = require('../../../utilities/constants');
const mongoConection = require('../../../utilities/conection');
const config = require('../../../utilities/config');
const helper = require('../../../utilities/helper');
const responseManager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model');
const schoolmodel = require('../../../models/school.model');
const mongoose = require('mongoose');
exports.change = async (req, res) => {
    const { schoolid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongoConection.useDb(constants.school);
        let adminData = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'school', 'View');
            if (getpermission) {
                if (schoolid && schoolid != '' && schoolid != null && schoolid != undefined && mongoose.Types.ObjectId.isValid(schoolid)) {
                    let adminData = await primary.model(constants.Model.school, schoolmodel).findById(schoolid).lean();
                    let obj = {
                        status: (adminData && adminData.status === true) ? false : true
                    };
                    let changestatus = await primary.model(constants.Model.school, schoolmodel).findByIdAndUpdate(schoolid, obj);
                    return responseManager.onSuccess('status change succesufully...', changestatus, res);
                } else {
                    return responseManager.onBadRequest({ message: 'schoolid is Invalid please Try again...!' }, res);
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