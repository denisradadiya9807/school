const express = require('express');
const mongoose = require('mongoose');
const mongoconnection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const responsemanager = require('../../../utilities/response.manager');
const attendancestudentmodel = require('../../../models/attendenceteacher.model');
const studentmodel = require('../../../models/student.model');
const async = require('async');

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

exports.list = async (req, res) => {
    const { classid, date, search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'attendancestudent', 'View');
            if (havepermissions) {
                // Parse "YYYY-MM"
                const [yearS, monthS] = date.split('-');
                const parsedYear = parseInt(yearS);
                const parsedMonth = parseInt(monthS);
                const totalDays = getDaysInMonth(parsedYear, parsedMonth);
                const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
                // Find matching students
                let studentList = await primary.model(constants.supermodel.student, studentmodel).find({
                    Student_Name: { '$regex': new RegExp(search, "i") }
                }).lean();
                const attendanceResults = [];
                async.forEachSeries(studentList, (student, next_student) => {
                    (async () => {
                        const dailyAttendance = [];
                        async.forEachSeries(daysArray, (day, next_date) => {
                            (async () => {
                                try {
                                    const fullDate = `${yearS}-${monthS.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const attendance = await primary.model(constants.supermodel.attendancestudent, attendancestudentmodel)
                                        .findOne({ studentid: student._id.toString(), classid: classid, date: fullDate })
                                        .lean();
                                    dailyAttendance.push({
                                        date: fullDate,
                                        status: attendance ? attendance.status : 'Absent',

                                    });
                                    next_date();
                                } catch (err) {
                                    next_date(err);
                                }
                            })();
                        }, () => {
                            attendanceResults.push({
                                studentid: student._id,
                                Student_Name: student.Student_Name,
                                Roll_No: student.Roll_No,
                                attendance: dailyAttendance
                            });
                            next_student();
                        });
                    })().catch((err) => {
                        next_student(err);
                    });
                }, (err) => {
                    if (err) {
                        return responsemanager.onError(err, res);
                    } else {
                        return responsemanager.onSuccess('Student Monthly Attendance List', attendanceResults, res);
                    }
                });
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
