const express = require('express');
const mongoose = require('mongoose');
const constants = require('../../../utilities/constants');
const mongoconnection = require('../../../utilities/conection');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const responsemanager = require('../../../utilities/response.manager');
const teachermodel = require('../../../models/teacher.model');
const teacherattendencemodel = require('../../../models/attendenceteacher.model');
const async = require('async');
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
exports.list = async (req, res) => {
    const { teacherid, search, date } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database)
        const primary = mongoconnection.useDb(constants.schoolsuperadmin)
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'attendanceteacher', 'View');
            if (havepermissions) {
                const [yearS, monthS] = date.split('-');
                const parsedyear = parseInt(yearS);
                const parsedMonth = parseInt(monthS);
                const totalDays = getDaysInMonth(parsedyear, parsedMonth);
                const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
                let teacherlist = await primary.model(constants.supermodel.teacher, teachermodel).find({
                    Teachername: { '$regex': new RegExp(search, "i") }
                }).lean();
                const attendanceResults = [];
                async.forEachSeries(teacherlist, (teacher, next_teacher) => {
                    (async () => {
                        const dailyAttendance = [];
                        async.forEachSeries(daysArray, (day, next_date) => {
                            (async () => {
                                try {
                                    const fullDate = `${yearS}-${monthS.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const attendance = await primary.model(constants.supermodel.attendanceteacher, teacherattendencemodel)
                                        .findOne({ teacherid: teacher._id.toString(), date: fullDate })
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
                                teacherid: teacher._id,
                                Teachername: teacher.Teachername,
                                attendance: dailyAttendance
                            });
                            next_teacher();
                        });
                    })().catch((err) => {
                        next_teacher(err);
                    });
                }, (err) => {
                    if (err) {
                        return responsemanager.onError(err, res);
                    } else {
                        return responsemanager.onSuccess('Teacher Monthly Attendance List', attendanceResults, res);
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
}
