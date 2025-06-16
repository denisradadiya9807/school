const express = require('express');
const mongoose = require('mongoose');
const mongoconnection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
const config = require('../../../utilities/config');
const studentdatamodel = require('../../../models/student.model');
const adminmodel = require('../../../models/admin.model');
const classmodel = require('../../../models/class.model');
const attendencemodel = require('../../../models/attendenceteacher.model');
const branchdatamodel = require('../../../models/schoolbranches.model');
const responsemanager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { studentid, branchid, classid, status, attentdenceid, date, filter } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'attendancestudent', 'insertupdate');
            if (havepermissions) {
                if (!new mongoose.Types.ObjectId(studentid)) {
                    return responsemanager.onBadRequest({ message: 'Student Id not Found' }, res);
                }
                let studentdata = await primary.model(constants.supermodel.student, studentdatamodel).findOne({ _id: new mongoose.Types.ObjectId(studentid) }).lean()
                if (!studentdata) {
                    return responsemanager.onBadRequest({ message: 'Student id is invalid' }, res);
                }
                if (!new mongoose.Types.ObjectId(classid)) {
                    return responsemanager.onBadRequest({ message: 'class Id not Found' }, res);
                }
                let classdata = await primary.model(constants.supermodel.class, classmodel).findOne({ _id: new mongoose.Types.ObjectId(classid) }).lean()
                if (!classdata) {
                    return responsemanager.onBadRequest({ message: 'class Id is invalid' }, res);
                }
                if (!new mongoose.Types.ObjectId(branchid)) {
                    return responsemanager.onBadRequest({ message: 'Branch Id not Found' }, res);
                }
                let branchdata = await primary1.model(constants.Model.schoolbranch, branchdatamodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean()
                if (!branchdata) {
                    return responsemanager.onBadRequest({ message: 'Branch Id is invalid' }, res);
                }
                const validstatus = ['Absent', 'Present', 'Leave'];
                if (!validstatus.includes(status)) {
                    return responsemanager.onBadRequest({ message: 'Status Must Be a Absent, Present Or Leave' }, res);
                }
                const filter = {
                    date: date,
                    studentid: studentid
                };
                if (attentdenceid) {
                    filter._id = { $ne: new mongoose.Types.ObjectId(attentdenceid) };
                }
                let exitingattendence = await primary.model(constants.supermodel.attendancestudent, attendencemodel).findOne(filter).lean();
                if (exitingattendence) {
                    return responsemanager.onBadRequest({ message: 'Student Attendence Already Exits...' }, res);
                }
                let obj = {
                    branchid: branchid,
                    studentid: studentid,
                    classid: classid,
                    status: status,
                    date: date
                }
                if (attentdenceid) {
                    attendupdate = await primary.model(constants.supermodel.attendancestudent, attendencemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(attentdenceid) }, obj).lean()
                    return responsemanager.onSuccess('Student Attendence Update Successfully...', attendupdate, res);
                }
                else {
                    let attentdence = await primary.model(constants.supermodel.attendancestudent, attendencemodel).create(obj);
                    return responsemanager.onSuccess('Student Attendence Complete...', attentdence, res);
                }
            } else {
                return responsemanager.accessdenied(res)
            }
        } else {
            return responsemanager.onBadRequest({ message: 'status' }, res);
        }
    } else {
        return responsemanager.onBadRequest({ message: 'Token' }, res);
    }
}