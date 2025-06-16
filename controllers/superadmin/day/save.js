var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var config = require('../../../utilities/config');
var responsemanager = require('../../../utilities/response.manager');
var mongooconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const adminmodel = require('../../../models/admin.model');
const daymodel = require('../../../models/day.model');
const schoolbranchmodel = require('../../../models/schoolbranches.model');
exports.save = async (req, res) => {
    const { dayname, status, dayid, branchid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        // console.log(" Valid token and adminId", req.token.adminId);
        let primary1 = mongooconnection.useDb(req.token.database);
        let primary = mongooconnection.useDb(constants.schoolsuperadmin);
        //  console.log("Using database:", req.token.database);
        let branch = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        //    console.log("Branch (admin) fetched from DB:", branch);
        if (branch && branch != null && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'day', 'insertupdate');
            if (havepermissions) {
                const existing = await primary.model(constants.supermodel.day, daymodel).findOne({ dayname: dayname }).lean();
                if (existing) {
                    return responsemanager.onBadRequest({ message: 'Branchname is Already exiting' }, res);
                }
                if (!mongoose.Types.ObjectId.isValid(branchid)) {
                    return responsemanager.onBadRequest({ message: 'Invalid branch ID' }, res);
                }
                const schoolBranch = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel)
                    .findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (!schoolBranch) {
                    return responsemanager.onBadRequest({ message: 'Branch not found with given ID' }, res);
                }
                let branch = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                if (!branch) {
                    return responsemanager.onBadRequest({ message: 'branch is not valid' }, res);
                }
                let obj = {
                    dayname: dayname,
                    branchid: branchid,
                    status: true
                };
                if (dayid) {
                    if (!mongoose.Types.ObjectId.isValid(dayid)) {
                        return responsemanager.onBadRequest({ message: 'dayid is not valid' }, res);
                    }
                    let branchupdate = await primary.model(constants.supermodel.day, daymodel)
                        .findOneAndUpdate(
                            { _id: new mongoose.Types.ObjectId(dayid) },
                            obj,
                            { new: true } // optional: return updated document
                        );
                    return responsemanager.onSuccess({ message: 'Branch updated successfully...' }, branchupdate, res);
                } else {
                    let academic = await primary.model(constants.supermodel.day, daymodel).create(obj);
                    return responsemanager.onSuccess('day Create Successfully...', academic, res);
                }
            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.onBadRequest({ message: 'status' }, res);
        }
    } else {
        return responsemanager.onBadRequest({ message: 'token' }, res);
    }
}
