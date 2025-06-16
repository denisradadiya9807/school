var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongoConnection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
const schoolmodel = require('../../../models/school.model');
const adminmodel = require('../../../models/admin.model');
const config = require('../../../utilities/config');
const responseManager = require('../../../utilities/response.manager');
const helper = require('../../../utilities/helper');
const leadmodel = require('../../../models/lead.model');
const schoolbranchesModel = require('../../../models/schoolbranches.model');
const roleModel = require('../../../models/role.model');
var async = require("async");
exports.save = async (req, res) => {
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const { leadid, schoolcode } = req.body;
        let primary = mongoConnection.useDb(constants.school);
        let superadminData = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (superadminData && superadminData != null && superadminData.status === true) {
            let havepermission = await config.getadminPermission(superadminData.roleid, 'school', 'insertupdate', primary);
            if (havepermission) {
                if (leadid && leadid.trim() != '' && leadid != null && leadid != undefined && mongoose.Types.ObjectId.isValid(leadid)) {
                    let leadsData = await primary.model(constants.Model.lead, leadmodel).findById(leadid).lean();
                    if (leadsData && leadsData != null && leadsData != undefined) {
                        let enPassword = await helper.passwordEncryptor(leadsData.schoolcode);
                        let currentyear = new Date().getFullYear();
                        let nextyear = parseInt(currentyear + 1);
                        let secondaryDatabase = 'db_' + leadsData.schoolname.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + '_' + currentyear + '_' + nextyear;
                        let secondary = mongoConnection.useDb(secondaryDatabase);
                        let databasearray = [];
                        databasearray.push(secondaryDatabase);

                        const schoolcode1 = await primary.model(constants.Model.school, schoolmodel).findOne({ schoolcode });
                        if (schoolcode1) {
                            return res.status(400).json({ message: "School code already exists. Lead not saved." });
                        }
                        let schoolobj = {
                            schoolcode: leadsData.schoolcode,
                            schoolname: leadsData.schoolname,
                            address: leadsData.address,
                            phoneno: leadsData.phoneno,
                            // country_wise_contact: (leadsData.country_wise_contact) ? leadsData.country_wise_contact : {},
                            email: leadsData.email,
                            database: databasearray,
                            status: true,
                            // isabletocreatebranch: false,
                            leadid: new mongoose.Types.ObjectId(leadid),
                            createdAtTimestamp: Date.now(),
                            updatedAtTimestamp: Date.now(),
                            createdBy: new mongoose.Types.ObjectId(req.token.adminId),
                            updatedBy: new mongoose.Types.ObjectId(req.token.adminId)
                        };
                        let newSchool = await primary.model(constants.Model.school, schoolmodel).create(schoolobj);
                        let adminobj = {
                            photo: leadsData.person_profile,
                            name: leadsData.contact_person_details.contact_person_name,
                            email: leadsData.contact_person_details.contact_person_email,
                            password: enPassword,
                            status: true,
                            mobile: leadsData.contact_person_details.contact_person_mobile,
                            gender: leadsData.contact_person_details.contact_person_gender,
                            accessallbranch: true,
                            accessbranches: [],
                            createdAtTimestamp: Date.now(),
                            updatedAtTimestamp: Date.now(),
                            createdBy_admin: new mongoose.Types.ObjectId(req.token.adminId)
                        };
                        let newadmin = await secondary.model(constants.Model.admin, adminmodel).create(adminobj);
                        // let settingobj = {
                        //     admintheme: '#3B418B',
                        //     student_app_color: '#3B418B',
                        //     teacher_app_color: '#3B418B',
                        //     visitor_app_color: '#3B418B',
                        //     createdBy: new mongoose.Types.ObjectId(newadmin._id),
                        //     updatedBy: new mongoose.Types.ObjectId(newadmin._id)
                        // };
                        // await secondary.model(constants.Model.settings, settingModel).create(settingobj);
                        let branchobj = {
                            branchname: leadsData.schoolname,
                            branchcode: leadsData.schoolcode,
                            email: leadsData.email,
                            phoneno: leadsData.phoneno,
                            schoolid: new mongoose.Types.ObjectId(newSchool._id),
                            address: leadsData.address,
                            createdAtTimestamp: Date.now(),
                            updatedAtTimestamp: Date.now(),
                            createdBy: new mongoose.Types.ObjectId(newadmin._id),
                            updatedBy: new mongoose.Types.ObjectId(newadmin._id)
                        };
                        let branchData = await secondary.model(constants.Model.schoolbranch, schoolbranchesModel).create(branchobj);
                        let accessbranchesarray = [];
                        accessbranchesarray.push(branchData._id.toString());
                        await secondary.model(constants.Model.admin, adminmodel).findByIdAndUpdate(newadmin._id, { accessbranches: accessbranchesarray });
                        let permissionarray = [];
                        async.forEachSeries(config.getadmincollection, (collectionname, next_collection) => {
                            let obj = {
                                displayname: collectionname.text,
                                collectionname: collectionname.value,
                                insertUpdate: true,
                                delete: true,
                                view: true
                            };
                            permissionarray.push(obj);
                            next_collection();
                        },
                            async () => {
                                //     let settingobj = {
                                //         displayname: 'Settings',
                                //         collectionName: 'settings',
                                //         insertUpdate: true,
                                //         delete: true,
                                //         view: true
                                //     };
                                // permissionarray.push(settingobj);
                                let permissionobj = {
                                    roleName: "School College Admin",
                                    permissions: permissionarray,
                                    createdAtTimestamp: Date.now(),
                                    updatedAtTimestamp: Date.now(),
                                    createdBy: new mongoose.Types.ObjectId(newadmin._id),
                                    updatedBy: new mongoose.Types.ObjectId(newadmin._id)
                                }
                                let newrole = await secondary.model(constants.Model.role, roleModel).create(permissionobj);
                                await secondary.model(constants.Model.admin, adminmodel).findByIdAndUpdate(newadmin._id, { roleid: new mongoose.Types.ObjectId(newrole._id), channelID: newadmin._id.toString().toUpperCase() + '_' + newadmin.toString() });
                                await primary.model(constants.Model.lead, leadmodel).findByIdAndUpdate(leadid, { converttoschool: true });
                                return responseManager.onSuccess('Leads convert to school or college successfully...', newSchool, res);
                            });
                    } else {
                        return responseManager.onBadRequest({ message: 'Leads already convert to school or college...!' }, res);
                    }
                } else {
                    return responseManager.onBadRequest({ message: 'Invalid leadid to convert to school or college...!' }, res);
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