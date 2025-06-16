var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var adminmodel = require('../../../models/admin.model');
var classmodel = require('../../../models/class.model');
var sectionmodel = require('../../../models/section.model');
var branchmodel = require('../../../models/schoolbranches.model');
var responseManager = require('../../../utilities/response.manager');
var mongoconnection = require('../../../utilities/conection');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
exports.save = async (req, res) => {
    const { classname, sectionid, classid, status, branchid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let classs = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (classs && classs != null && classs.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, classs.roleid, 'class', 'insertupdate');
            if (havepermissions) {
                let existing = await primary.model(constants.supermodel.class, classmodel).findOne({ classname }).lean();
                if (existing) {
                    return responseManager.onBadRequest({ message: 'Class Already Exiting' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(branchid)) {
                    return responseManager.onBadRequest({ message: 'Branch id is invalid...' }, res);
                }
                const schoolBranch = await primary1.model(constants.Model.schoolbranch, branchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (!schoolBranch) {
                    return responseManager.onBadRequest({ message: 'Branch Not Found This Id..' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(sectionid)) {
                    return responseManager.onBadRequest({ message: 'section id is invalid...' }, res);
                }
                const section = await primary.model(constants.supermodel.section, sectionmodel).findOne({ _id: new mongoose.Types.ObjectId(sectionid) }).lean();
                if (!section) {
                    return responseManager.onBadRequest({ message: 'Sectino Not Found This Id..' }, res);
                }
                let obj = {
                    classname: classname,
                    sectionid: sectionid,
                    status: true,
                    branchid: branchid
                }
                if (classid) {
                    let classupdate = await primary.model(constants.supermodel.class, classmodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(classid) }, obj);
                    return responseManager.onSuccess({ message: 'ClassUpdate SuccessFully...' }, classupdate, res);
                } else {
                    let classcreate = await primary.model(constants.supermodel.class, classmodel).create(obj);
                    return responseManager.onSuccess({ message: 'class Created successfully...' }, classcreate, res);
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
}


