const express = require('express');
const router = express.Router();
const constants = require('../../../utilities/constants');
const mongoconnection = require('../../../utilities/conection');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const holidaymodel = require('../../../models/holiday.model');
const branchmodel = require('../../../models/schoolbranches.model');
const mongoose = require('mongoose');
const responsemanager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { startdate, enddate, holidayid, holidaytitle, branchid, } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId);
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'holiday', 'insertupdate');
            if (havepermissions) {
                if (holidaytitle && holidaytitle != '' && holidaytitle != null && holidaytitle != undefined) {
                    if (!new mongoose.Types.ObjectId(branchid)) {
                        return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                    }
                    let branch = await primary1.model(constants.Model.schoolbranch, branchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                    if (!branch) {
                        return responsemanager.onBadRequest({ message: 'branch Id Is invalid' }, res);
                    }
                    const fromdatestemp = new Date(`${startdate}`).getTime();
                    const enddatestemp = new Date(`${enddate}`).getTime();
                    if (fromdatestemp >= enddatestemp) {
                        return responsemanager.onBadRequest({ message: 'Invalid Date .end date and start date check' }, res);
                    }
                    const overloop = {
                        branchid: new mongoose.Types.ObjectId(branchid),
                        fromdatestemp: { $lt: enddatestemp },
                        enddatestemp: { $gt: fromdatestemp },
                    };
                    if (holidayid) {
                        overloop._id = { $ne: new mongoose.Types.ObjectId(holidayid) };
                    }
                    const overlapping = await primary.model(constants.supermodel.holiday, holidaymodel).findOne(overloop).lean();
                    if (overlapping) {
                        return responsemanager.onBadRequest({ message: 'The Selected Date Already Holiday...' }, res);
                    }
                    let obj = {
                        startdate: startdate,
                        fromdatestemp: fromdatestemp,
                        enddatestemp: enddatestemp,
                        enddate: enddate,
                        holidaytitle: holidaytitle,
                        branchid: branchid
                    }
                    if (holidayid) {
                        let updatetimetable = await primary.model(constants.supermodel.holiday, holidaymodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(holidayid) }, obj, { new: true }).lean();
                        return responsemanager.onSuccess('Holiday Update Successfully...', updatetimetable, res);
                    } else {
                        let holidayfree = await primary.model(constants.supermodel.holiday, holidaymodel).create(obj);
                        return responsemanager.onSuccess('Holiday Create Successfully...', holidayfree, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'Holiday Title Is Missing...' }, res);
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




