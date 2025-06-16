var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var helper = require('../../../utilities/helper');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var config = require('../../../utilities/config');
var async = require('async');
const adminmodel = require('../../../models/admin.model');
const schoolmodel = require('../../../models/school.model');
const roleModel = require('../../../models/superrole.model');
const academimodel = require('../../../models/addacademicyear.model');
const responsemanager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { academicid, academicyear, startDate, endDate, status, database } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        // console.log('111', req.token.adminId);
        const primary = mongoconnection.useDb(req.token.database);
        const primary1 = mongoconnection.useDb(constants.schoolsuperadmin);
        let superadminData = primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        // console.log('222', req.token.adminId);
        if (superadminData && superadminData != null && superadminData.status === true) {
            // console.log('super', superadminData.status);
            let havepermissions = await config.getsuperadminPermission(req, superadminData.roleid, 'academicyear', 'insertupdate');
            // console.log('33', havepermissions);
            if (havepermissions) {
                if (academicyear && academicyear != '' && academicyear != null && academicyear != undefined) {
                    if (startDate && startDate != '' && startDate != null && startDate != undefined) {
                        if (endDate && endDate != '' && endDate != null && endDate != undefined) {
                            if (status && status != '' && status != null && status != undefined) {
                                const existing = await primary1.model(constants.supermodel.academicyear, academimodel).findOne({ academicyear });
                                if (existing) {
                                    return res.status(400).json({ message: 'Academic Year Id already Exiting' });
                                }
                                let obj = {
                                    academicyear: academicyear,
                                    startDate: startDate,
                                    endDate: endDate,
                                    status: true
                                };
                                if (academicid) {
                                    academicupdate = await primary1.model(constants.supermodel.academicyear, academimodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(academicid) }, obj)
                                    if (!academicupdate) {
                                        return responsemanager.onBadRequest({ message: 'Academic ID Not valid' }, res);
                                    }
                                    return responsemanager.onSuccess('Academic Year Is updated successfully', academicupdate, res);
                                } else {
                                    let academic = await primary1.model(constants.supermodel.academicyear, academimodel).create(obj);
                                    return responsemanager.onSuccess('Academic Year Create Successfully...', academic, res);
                                }
                            } else {
                                return responsemanager.onBadRequest({ message: 'status is not valid' }, res);
                            }
                        } else {
                            return responsemanager.onBadRequest({ message: 'end date is not valid' }, res);
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'start date is not valid' }, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'Academic year is not valid' }, res);
                }

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


