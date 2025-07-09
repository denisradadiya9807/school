const express = require('express');
const router = express.Router();
const mongoconnection = require('../../../utilities/conection');
const mongoose = require('mongoose');
const constants = require('../../../utilities/constants');
const config = require('../../../utilities/config');
const responsemanager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model')
const examtypemodel = require('../../../models/examtype.model')
const exammodel = require('../../../models/exam.model')
const sectionmodel = require('../../../models/section.model')
const boardmodel = require('../../../models/board.model')
const semestermodel = require('../../../models/semester.model')
const standardmodel = require('../../../models/standard.model')
const streammodel = require('../../../models/stream.model')
const classmodel = require('../../../models/class.model')
const schoolbranchmodel = require('../../../models/schoolbranches.model')

exports.save = async (req, res) => {
    const { ExamType, section, board, semester, standard, stream, classs, branch, examid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoconnection.useDb(req.token.database);
        const primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null & admindata.status === true) {
            let haveparmission = await config.getsuperadminPermission(req, admindata.roleid, 'exam', 'insertupdate');
            if (haveparmission) {
                if (!mongoose.Types.ObjectId.isValid(branch)) {
                    return responsemanager.onBadRequest({ message: 'Not Found branch' }, res);
                }
                let branchi = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel).findOne({ _id: new mongoose.Types.ObjectId(branch) }).lean();
                // console.log('bracnh', branchi);
                if (!branchi) {
                    return responsemanager.onBadRequest({ message: 'branch Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(section)) {
                    return responsemanager.onBadRequest({ message: 'Not Found Section' }, res);
                }
                let sectioni = await primary.model(constants.supermodel.section, sectionmodel).findOne({ _id: new mongoose.Types.ObjectId(section) }).lean();
                // console.log('sect', sectioni);

                if (!sectioni) {
                    return responsemanager.onBadRequest({ message: 'Section Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(board)) {
                    return responsemanager.onBadRequest({ message: 'Not Found board' }, res);
                }
                let boardid = await primary.model(constants.supermodel.board, boardmodel).findOne({ _id: new mongoose.Types.ObjectId(board) }).lean();
                if (!boardid) {
                    return responsemanager.onBadRequest({ message: 'board Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(stream)) {
                    return responsemanager.onBadRequest({ message: 'Not Found stream' }, res);
                }
                let streami = await primary.model(constants.supermodel.stream, streammodel).findOne({ _id: new mongoose.Types.ObjectId(stream) }).lean();
                if (!streami) {
                    return responsemanager.onBadRequest({ message: 'stream Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(semester)) {
                    return responsemanager.onBadRequest({ message: 'Not Found semester' }, res);
                }
                let semesteri = await primary.model(constants.supermodel.semester, semestermodel).findOne({ _id: new mongoose.Types.ObjectId(semester) }).lean();
                if (!semesteri) {
                    return responsemanager.onBadRequest({ message: 'semester Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(standard)) {
                    return responsemanager.onBadRequest({ message: 'Not Found standard' }, res);
                }
                let standardi = await primary.model(constants.supermodel.standard, standardmodel).findOne({ _id: new mongoose.Types.ObjectId(standard) }).lean();
                if (!standardi) {
                    return responsemanager.onBadRequest({ message: 'standard Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(classs)) {
                    return responsemanager.onBadRequest({ message: 'Not Found classsID' }, res);
                }
                let classsi = await primary.model(constants.supermodel.class, classmodel).findOne({ _id: new mongoose.Types.ObjectId(classs) }).lean();
                if (!classsi) {
                    return responsemanager.onBadRequest({ message: 'classs Id Is invalid' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(ExamType)) {
                    return responsemanager.onBadRequest({ message: 'ExamType Not... Found' }, res);
                }
                let examtypei = await primary.model(constants.supermodel.examtype, examtypemodel).findOne({ _id: new mongoose.Types.ObjectId(ExamType) }).lean();
                // console.log('exea', examtypei);

                if (!examtypei) {
                    return responsemanager.onBadRequest({ message: 'examtype Not Found' }, res);
                }
                let obj = {
                    ExamType: ExamType,
                    section: section,
                    board: board,
                    semester: semester,
                    standard: standard,
                    stream: stream,
                    classs: classs,
                    branch: branch
                }
                if (examid) {
                    examupdate = await primary.model(constants.supermodel.exam, exammodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(examid) }, obj, { new: true }).lean();
                    return responsemanager.onSuccess('Exam Update Successfully....', examupdate, res);
                } else {
                    exams = await primary.model(constants.supermodel.exam, exammodel).create(obj);
                    return responsemanager.onSuccess('Exam Created Successfully...', exams, res);
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
