const express = require('express');
const router = express.Router();
const config = require('../../../utilities/config');
const constants = require('../../../utilities/constants');
const mongoconnection = require('../../../utilities/conection');
const responsemanager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model');
const teachermodel = require('../../../models/teacher.model');
const schoolbranchmodel = require('../../../models/schoolbranches.model');
const teacherattendencemodel = require('../../../models/attendenceteacher.model');
const mongoose = require('mongoose');
exports.save = async (req, res) => {
    const { teacherid, branchid, status, date, teacherattendid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'attendanceteacher', 'insertupdate');
            if (havepermissions) {
                if (!mongoose.Types.ObjectId.isValid(teacherid)) {
                    return responsemanager.onBadRequest({ message: 'Teacher Id Not Found' }, res);
                }
                let teacherdata = await primary.model(constants.supermodel.teacher, teachermodel).findOne({ _id: new mongoose.Types.ObjectId(teacherid) }).lean();
                if (!teacherdata) {
                    return responsemanager.onBadRequest({ message: 'Teacher Id Not Valid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(branchid)) {
                    return responsemanager.onBadRequest({ message: 'Branch Id Not Found' }, res);
                }
                let branchdata = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (!branchdata) {
                    return responsemanager.onBadRequest({ message: 'Branch Id Not Valid' }, res);
                }

                const validstatus = ['Absent', 'Present', 'Leave', 'Halfleave'];
                if (!validstatus.includes(status)) {
                    return responsemanager.onBadRequest({ message: 'Status Must Be a Valid Status' }, res);
                }
                const filter = {
                    date: date,
                    teacherid: teacherid
                };
                if (teacherattendid) {
                    filter._id = { $ne: new mongoose.Types.ObjectId(teacherattendid) }
                }
                let exitingattendence = await primary.model(constants.supermodel.attendanceteacher, teacherattendencemodel).findOne(filter).lean();
                if (exitingattendence) {
                    return responsemanager.onBadRequest({ message: 'Teacher Attendence Already Exits' }, res);
                }
                let obj = {
                    branchid: branchid,
                    teacherid: teacherid,
                    status: status,
                    date: date
                }
                if (teacherattendid) {
                    attendupdate = await primary.model(constants.supermodel.attendanceteacher, teacherattendencemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(teacherattendid) }, obj, { new: true }).lean()
                    // console.log("dejish", attendupdate);
                    return responsemanager.onSuccess('Student Attendence Update Successfully...', attendupdate, res);
                }
                else {
                    let attentdence = await primary.model(constants.supermodel.attendanceteacher, teacherattendencemodel).create(obj);
                    return responsemanager.onSuccess('Student Attendence Complete...', attentdence, res);
                }
            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.onBadRequest(res);
        }
    } else {
        return responsemanager.unauthorisedRequest(res);
    }
}