// const express = require('express');
// const router = express.Router();
// var mongoose = require('mongoose');
// var mongoConnection = require('../../../utilities/conection');
// var constant = require('../../../utilities/constants');
// var config = require('../../../utilities/config');
// const adminmodel1 = require('../../../models/admin.model');
// var ResponseManager = require('../../../utilities/response.manager');
// const superrolemodel = require('../../../models/superrole.model');
// const schoolmodel = require('../../../models/school.model');
// exports.save = async (req, res) => {
//     const { roleid, roleName, permissions } = req.body;
//     console.log("req.body->", req.token);
//     if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminid)) {
//         let primary = mongoConnection.useDb(constant.schoolsuperadmin);
//         let adminData = .model(constant.Model.school, await primaryschoolmodel).findById(req.token.adminid).lean();
//         console.log("adminData->", adminData);
//         if (adminData && adminData != null && adminData.status === true) {
//             console.log("adminData->", adminData);
//             let getpermission = await config.getsuperadminPermission(adminData.roleid, 'role', 'Insertupdate')
//             if (getpermission) {
//                 if (roleName && roleName != '' && roleName != null && roleName != undefined) {
//                     if (permissions && permissions != '' && permissions != null && permissions != undefined) {
//                         if (roleid && roleid != '' && roleid != null && roleid != undefined && mongoose.Types.ObjectId.isValid(roleid)) {
//                             let roleupdate = await primary.model(constant.supermodel.role, superrolemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(roleid) }, {
//                                 roleName: roleName,
//                                 permissions: permissions
//                             },);
//                             if (!roleupdate) {
//                                 return ResponseManager.onBadRequest({ message: 'please check rolename is not found ' }, res);
//                             }
//                             return ResponseManager.onSuccess('role Update successfully', roleupdate, res);
//                         } else {
//                             return ResponseManager.onBadRequest({ messaage: 'invalid role id ......!' })
//                         }
//                     } else {
//                         let existingrole = await primary.model(constant.supermodel.role, superrolemodel).findOne({ roleName: roleName }).lean();
//                         if (!existingrole) {
//                             const newrole = await primary.model(constant.supermodel.role, superrolemodel).create({
//                                 roleName: roleName,
//                                 permissions: permissions
//                             });
//                             return ResponseManager.onSuccess('role create successfully...', newrole, res);
//                         } else {
//                             return ResponseManager.onBadRequest({ message: 'Role Already existing' }, res);
//                         }
//                     }

//                 } else {
//                     return ResponseManager.onBadRequest({ message: 'roleName check ' }, res);
//                 }
//             } else {
//                 return ResponseManager.onBadRequest({ message: 'Role ID check ' }, res);
//             }

//         } else {
//             return ResponseManager.unauthorisedRequest({ message: 'status check ' }, res);
//         }
//     } else {
//         return ResponseManager.unauthorisedRequest({ message: 'token not connect ' }, res);
//     }
// };


const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const mongoConnection = require('../../../utilities/conection');
const constant = require('../../../utilities/constants');
const helper = require('../../../utilities/helper');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const rolemodel = require('../../../models/role.model');
const superrolemodel = require('../../../models/superrole.model');
const ResponseManager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { roleid, roleName, permissions } = req.body;
    // console.log("req.body->", req.body);
    // console.log("token", req.token);
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        // console.log(req.token);

        // if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminID)) {
        let primary = mongoConnection.useDb(constant.school);
        let primary1 = mongoConnection.useDb(constant.supermodel);

        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminid).lean();
        if (adminData && adminData != null && adminData.status === true) {
            console.log("adminData->", adminData);
            let getpermission = await config.getsuperadminPermission(adminData.roleid, 'role', 'insertupdate')
            if (getpermission) {
                if (roleName && roleName != '' && roleName != null && roleName != undefined) {
                    if (permissions && permissions != '' && permissions != null && permissions != undefined) {
                        if (roleid && roleid != '' && roleid != null && roleid != undefined && mongoose.Types.ObjectId.isValid(roleid)) {
                            let roleupdate = await primary.model(constant.Model.role, adminmodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(roleid) }, {
                                roleName: roleName,
                                permissions: permissions
                            },);
                            if (!roleupdate) {
                                return ResponseManager.onBadRequest({ message: 'Please Check Rolename is not found...' }, res);
                            }
                            return ResponseManager.onSuccess('role updated sucessfully', roleupdate, res);
                        } else {
                            let existingrole = await primary1.model(constant.supermodel.role, superrolemodel).findOne({ roleName: roleName }).lean();
                            if (!existingrole) {
                                const newrole = await primary1.model(constant.supermodel.role, superrolemodel).create({
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

