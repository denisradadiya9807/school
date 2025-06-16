const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoconnection = require('../../../utilities/conection');
const rolemodel = require('../../../models/role.model');
const constant = require('../../../utilities/constants');
const responsemanager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model');
const config = require('../../../utilities/config');
const helper = require('../../../utilities/helper');


exports.rolelist = async (req, res) => {
    const { search } = req.body;
    // console.log(req.token);
    // console.log("✅ Valid ObjectId:", mongoose.Types.ObjectId.isValid(req.token?.adminId));
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'role', 'View');
            if (getpermission) {
                let roleData = await primary.model(constant.Model.role, rolemodel).find({ roleName: { '$regex': new RegExp(search, "i") }, }).lean();
                return responsemanager.onSuccess('roles list...', roleData, res);
            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
};
exports.withpagination = async (req, res) => {
    const { page, limit } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongoconnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            primary.model(constant.Model.role, rolemodel).paginate({
            }, {
                page,
                limit: parseInt(limit),
                sort: { _id: -1 },
                lean: true
            }).then((roleData) => {
                return responsemanager.onSuccess('role Data...', roleData, res);
            }).catch((error) => {
                return responsemanager.onError(error, res);
            })
        } else {
            return responsemanager.unauthorisedRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
};
