let express = require('express');
let router = express.Router();
let responsemanager = require('../../../utilities/response.manager');
let constants = require('../../../utilities/constants');
let mongoconnection = require('../../../utilities/conection');
let config = require('../../../utilities/config');
let adminmodel = require('../../../models/admin.model');
let subjectmodel = require('../../../models/subject.model');
let sectionmodel = require('../../../models/section.model');
let classmodel = require('../../../models/class.model');
let mongoose = require('mongoose');
const schoolbranchesModel = require('../../../models/schoolbranches.model');
exports.save = async (req, res) => {
    const { branchid, subjectid, sectionid, classid, subjectname, profile } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admin = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admin && admin != null && admin.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admin.roleid, 'subject', 'insertupdate');
            if (havepermissions) {
                // if (branchid && branchid != '' && branchid != null && branchid != undefined) {
                //     if (sectionid && sectionid != '' && sectionid != null && sectionid != undefined) {
                //         if (classid && classid != '' && classid != null && classid != undefined) {
                if (subjectname && subjectname != '' && subjectname != null && subjectname != undefined) {
                    const exicting = await primary.model(constants.supermodel.subject, subjectmodel).findOne({ subjectname: subjectname }).lean();
                    if (exicting) {
                        return responsemanager.onBadRequest({ message: 'Subjename is already Exiting' }, res);
                    }
                    const branch = await primary1.model(constants.Model.schoolbranch, schoolbranchesModel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                    if (!branch) {
                        return responsemanager.onBadRequest({ message: 'branchid not found' }, res);
                    }
                    const sections = await primary.model(constants.supermodel.section, sectionmodel).findOne({ _id: new mongoose.Types.ObjectId(sectionid) }).lean();
                    if (!sections) {
                        return responsemanager.onBadRequest({ message: 'sectionid not found' }, res);
                    }
                    const classs = await primary.model(constants.supermodel.class, classmodel).findOne({ _id: new mongoose.Types.ObjectId(classid) }).lean();
                    if (!classs) {
                        return responsemanager.onBadRequest({ message: 'Class not found' }, res);
                    }
                    let imagepath = '';
                    if (req.file) {
                        imagepath = 'images/' + req.file.filename;
                    }
                    let obj = {
                        branchid: branchid,
                        sectionid: sectionid,
                        classid: classid,
                        subjectname: subjectname,
                        profile: imagepath
                    }
                    if (subjectid) {
                        const update = await primary.model(constants.supermodel.subject, subjectmodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(subjectid) }).lean();
                        return responsemanager.onSuccess('Subject data update successfully...', update, res);
                    } else {
                        const subjectadd = await primary.model(constants.supermodel.subject, subjectmodel).create(obj);
                        return responsemanager.onSuccess('Subject Data Created Successfully...', subjectadd, res);
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'Please Valid Subjectname' }, res)
                }
                //         } else {
                //             return responsemanager.onBadRequest({ message: 'Please Valid Classname' }, res)
                //         }
                //     } else {
                //         return responsemanager.onBadRequest({ message: 'Please Valid Section' }, res)
                //     }
                // } else {
                //     return responsemanager.onBadRequest({ message: 'please valid Branchid... ' }, res)
                // }
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


