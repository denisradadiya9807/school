var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var adminmodel = require('../../../models/admin.model');
var sectionmodel = require('../../../models/section.model');
var boardmodel = require('../../../models/board.model');
var streammodel = require('../../../models/stream.model');
var semestermodel = require('../../../models/semester.model');
var standardmodel = require('../../../models/standard.model');
var classmodel = require('../../../models/class.model');
var daymodel = require('../../../models/day.model');
var subjectmodel = require('../../../models/subject.model');
var timetablemodel = require('../../../models/timetable.model');
var timetablemodel = require('../../../models/timetable.model');
var teachermodel = require('../../../models/teacher.model');
var branchmodel = require('../../../models/schoolbranches.model');
var mongoose = require('mongoose');
var responsemanager = require('../../../utilities/response.manager');
exports.save = async (req, res) => {
    const { startDateTimestamp, endDateTimestamp, start_date, end_date, timetableid, sectionid, branchid, boardid, streamid, semesterid, standardid, classid, dayid, starttime, endtime, teacherid, subjectid, timetable, breaks } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let academicdata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (academicdata && academicdata != null && academicdata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, academicdata.roleid, 'student', 'View');
            if (havepermissions) {
                if (sectionid && sectionid != '' && sectionid != null && sectionid != undefined) {
                    if (boardid && boardid != '' && boardid != null && boardid != undefined) {
                        if (streamid && streamid != '' && streamid != null && streamid != undefined) {
                            if (standardid && standardid != '' && standardid != null && standardid != undefined) {
                                if (semesterid && semesterid != '' && semesterid != null && semesterid != undefined) {
                                    if (dayid && dayid != '' && dayid != null && dayid != undefined) {
                                        if (classid && classid != '' && classid != null && classid != undefined) {
                                            // if (timetable && timetable != '' && timetable != null && timetable != undefined) {
                                            // if (status && status != '' && status != null && status != undefined) {
                                            if (branchid && branchid != '' && branchid != null && branchid != undefined) {
                                                // let exiting = await primary.model(constants.supermodel.timetable, timetablemodel).findOne({ startDateTimestamp: startDateTimestamp }).lean();
                                                // if (exiting) {
                                                //     return responsemanager.onBadRequest({ message: 'Time Table Already Exiting...' }, res);
                                                // }

                                                if (!new mongoose.Types.ObjectId(sectionid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found SectionID' }, res);
                                                }
                                                let section = await primary.model(constants.supermodel.section, sectionmodel).findOne({ _id: new mongoose.Types.ObjectId(sectionid) }).lean();
                                                if (!section) {
                                                    return responsemanager.onBadRequest({ message: 'Section Id Is invalid' }, res);
                                                }
                                                if (!new mongoose.Types.ObjectId(boardid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found SectionID' }, res);
                                                }
                                                let board = await primary.model(constants.supermodel.board, boardmodel).findOne({ _id: new mongoose.Types.ObjectId(boardid) }).lean();
                                                if (!board) {
                                                    return responsemanager.onBadRequest({ message: 'board Id Is invalid' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(streamid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found SectionID' }, res);
                                                }
                                                let stream = await primary.model(constants.supermodel.stream, streammodel).findOne({ _id: new mongoose.Types.ObjectId(streamid) }).lean();
                                                if (!stream) {
                                                    return responsemanager.onBadRequest({ message: 'stream Id Is invalid' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(semesterid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found streamID' }, res);
                                                }
                                                let semester = await primary.model(constants.supermodel.semester, semestermodel).findOne({ _id: new mongoose.Types.ObjectId(semesterid) }).lean();
                                                if (!semester) {
                                                    return responsemanager.onBadRequest({ message: 'semester Id Is invalid' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(standardid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found standardID' }, res);
                                                }
                                                let standard = await primary.model(constants.supermodel.standard, standardmodel).findOne({ _id: new mongoose.Types.ObjectId(standardid) }).lean();
                                                if (!standard) {
                                                    return responsemanager.onBadRequest({ message: 'standard Id Is invalid' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(classid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                                                }
                                                let classs = await primary.model(constants.supermodel.class, classmodel).findOne({ _id: new mongoose.Types.ObjectId(classid) }).lean();
                                                if (!classs) {
                                                    return responsemanager.onBadRequest({ message: 'classs Id Is invalid' }, res);
                                                }
                                                if (!new mongoose.Types.ObjectId(dayid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                                                }
                                                let day = await primary.model(constants.supermodel.day, daymodel).findOne({ _id: new mongoose.Types.ObjectId(dayid) }).lean();
                                                if (!day) {
                                                    return responsemanager.onBadRequest({ message: 'day Id Is invalid' }, res);
                                                }
                                                if (!new mongoose.Types.ObjectId(subjectid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(teacherid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                                                }

                                                if (!new mongoose.Types.ObjectId(branchid)) {
                                                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                                                }
                                                let branch = await primary1.model(constants.Model.schoolbranch, branchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                                                if (!branch) {
                                                    return responsemanager.onBadRequest({ message: 'branch Id Is invalid' }, res);
                                                }
                                                if (breaks === true) {
                                                    if (subjectid || teacherid) {
                                                        return responsemanager.onBadRequest({ message: 'Subject And Teacher are empty...' }, res);
                                                    }
                                                } else {
                                                    if (!subjectid || !teacherid) {
                                                        return responsemanager.onBadRequest({ message: 'Please Select Teacherid and Subjectid...' }, res);
                                                    }
                                                }
                                                const fromtimestemp = new Date(`${start_date}T${starttime}`).getTime();
                                                const totimestemp = new Date(`${end_date}T${endtime}`).getTime();
                                                if (fromtimestemp >= totimestemp) {
                                                    return res.status(400).json({ message: 'Invalid time range. Start time must be before end time.' });
                                                }
                                                const overloop = {
                                                    timetable: {
                                                        $elemMatch: {
                                                            fromtimestemp: { $lt: totimestemp },
                                                            totimestemp: { $gt: fromtimestemp }
                                                        }
                                                    }
                                                };
                                                if (timetableid) {
                                                    overloop._id = { $ne: new mongoose.Types.ObjectId(timetableid) };
                                                }

                                                const overlappingBooking = await primary
                                                    .model(constants.supermodel.timetable, timetablemodel)
                                                    .findOne(overloop).lean();
                                                if (overlappingBooking) {
                                                    return res.status(400).json({ message: 'The selected time slot is already booked.' });
                                                }


                                                let timetables = [{
                                                    fromtimestemp: fromtimestemp,
                                                    totimestemp: totimestemp,
                                                    starttime: starttime,
                                                    endtime: endtime,
                                                    subjectid: subjectid,
                                                    teacherid: teacherid,
                                                    breaks: breaks,
                                                }];
                                                const obj = {
                                                    end_date: end_date,
                                                    start_date: start_date,
                                                    sectionid: sectionid,
                                                    boardid: boardid,
                                                    streamid: streamid,
                                                    timetable: [],
                                                    standardid: standardid,
                                                    semesterid: semesterid,
                                                    dayid: dayid,
                                                    classid: classid,
                                                    timetable: timetables,
                                                    status: true,
                                                    branchid: branchid
                                                }
                                                if (timetableid) {
                                                    let updatetimetable = await primary.model(constants.supermodel.timetable, timetablemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(timetableid) }, obj, { new: true }).lean();
                                                    return responsemanager.onSuccess('TimeTable Update Sucessfully...', updatetimetable, res);
                                                } else {
                                                    let timetableadd = await primary.model(constants.supermodel.timetable, timetablemodel).create(obj);
                                                    return responsemanager.onSuccess('TimeTable Add Sucessfully...', timetableadd, res);
                                                }
                                            } else {
                                                return responsemanager.onBadRequest({ message: 'branchid is Require' }, res);
                                            }
                                            // } else {
                                            //     return responsemanager.onBadRequest({ message: 'status is Require' }, res);
                                            // }
                                            // } else {
                                            //     return responsemanager.onBadRequest({ message: 'timetable is Require' }, res);
                                            // }
                                        } else {
                                            return responsemanager.onBadRequest({ message: 'classid is Require' }, res);
                                        }
                                    } else {
                                        return responsemanager.onBadRequest({ message: 'dayid is Require' }, res);
                                    }
                                } else {
                                    return responsemanager.onBadRequest({ message: 'semesterid is Require' }, res);
                                }
                            } else {
                                return responsemanager.onBadRequest({ message: 'standardid is Require' }, res);
                            }
                        } else {
                            return responsemanager.onBadRequest({ message: 'streamid is Require' }, res);
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'boardid is Require' }, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'sectionid is Require' }, res);
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