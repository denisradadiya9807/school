const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const mongoConnection = require('../../../utilities/conection');
const constant = require('../../../utilities/constants');
const helper = require('../../../utilities/helper');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const rolemodel = require('../../../models/role.model');
const ResponseManager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { roleid, roleName, permissions } = req.body;
    // console.log("req.body->", req.body);
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        // console.log(req.token);
        // console.log("token", req.token);
        // if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminID)) {
        let primary = mongoConnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != null && adminData.status === true) {
            // console.log("adminData->", adminData);
            let getpermission = await config.getadminPermission(adminData.roleid, 'role', 'insertupdate')
            if (getpermission) {
                if (roleName && roleName != '' && roleName != null && roleName != undefined) {
                    if (permissions && permissions != '' && permissions != null && permissions != undefined) {
                        if (roleid && roleid != '' && roleid != null && roleid != undefined && mongoose.Types.ObjectId.isValid(roleid)) {
                            let roleupdate = await primary.model(constant.Model.role, rolemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(roleid) }, {
                                roleName: roleName,
                                permissions: permissions
                            },);
                            if (!roleupdate) {
                                return ResponseManager.onBadRequest({ message: 'Please Check Rolename is not found...' }, res);
                            }
                            return ResponseManager.onSuccess('role updated sucessfully', roleupdate, res);
                        } else {
                            let existingrole = await primary.model(constant.Model.role, rolemodel).findOne({ roleName: roleName }).lean();
                            if (!existingrole) {
                                const newrole = await primary.model(constant.Model.role, rolemodel).create({
                                    roleName: roleName,
                                    permissions: permissions
                                });

                                return ResponseManager.onSuccess('role created successfully.....', newrole, res);
                            } else {
                                return ResponseManager.onBadRequest({ message: 'role already existing...!' }, res);
                            }
                        }
                    } else {
                        return ResponseManager.onBadRequest({ message: 'Enter And Valid Permission...' }, res);
                    }
                } else {
                    return ResponseManager.onBadRequest({ message: 'Enter Role Name...' }, res);
                }
            } else {
                return ResponseManager.accessdenied(res);
            }
        } else {
            return ResponseManager.unauthorisedRequest(res);
        }
    } else {

        return ResponseManager.unauthorisedRequest(res);
    }

};

