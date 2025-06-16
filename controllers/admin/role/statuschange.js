var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongoconnection = require('../../../utilities/conection');
const constant = require('../../../utilities/constants');
const adminmodel = require('../../../models/admin.model');
const rolemodel = require('../../../models/role.model');
const config = require('../../../utilities/config');
const responseManager = require('../../../utilities/response.manager');
exports.changestatuss = async (req, res) => {
    const { roleid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongoconnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        // console.log('fffff', req.token.adminId);
        if (adminData && adminData != null && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'role', 'insertupdate')
            // console.log("Has permission to insert/update role?", getpermission);
            if (getpermission) {
                if (roleid && roleid != '' && roleid != null && roleid != undefined && mongoose.Types.ObjectId.isValid(roleid)) {
                    let roleData = await primary.model(constant.Model.role, rolemodel).findById(roleid).lean();

                    let obj = {
                        status: (roleData && roleData.status === true) ? false : true
                    }
                    let changestatus = await primary.model(constant.Model.role, rolemodel).findByIdAndUpdate(roleid, obj);
                    return responseManager.onSuccess('status change successfully...', changestatus, res);
                } else {
                    return responseManager.onBadRequest({ message: 'role is is an valid' }, res);
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


