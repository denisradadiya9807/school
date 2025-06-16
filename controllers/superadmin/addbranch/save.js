var express = require('express');
var router = express.Router();
var constants = require('../../../utilities/constants');
var config = require('../../../utilities/config');
var responsemanager = require('../../../utilities/response.manager');
var mongooconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
const adminmodel = require('../../../models/admin.model');
const schoolbranchesModel = require('../../../models/schoolbranches.model');

exports.save = async (req, res) => {
    const { branchname, branchcode, schoolid, email, address, phoneno, branchid, status } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary = mongooconnection.useDb(req.token.database);
        let branch = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (branch && branch != null && branch.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, branch.roleid, 'schoolbranch', 'insertupdate');
            if (havepermissions) {  
                if (branchname && branchname != '' && branchname != null && branchname != undefined) {
                    // if (branchcode && branchcode != null && branchcode != '' && branchcode != null && branchcode != undefined) {
                    if (phoneno && phoneno != null && phoneno != '' && phoneno != null && phoneno != undefined) {
                        if (address && address != null && address != '' && address != null && address != undefined) {
                            if (email && email != null && email != '' && email != null && email != undefined) {
                                // if (schoolid && schoolid != null && schoolid != '' && schoolid != null && schoolid != undefined) {
                                const existing = await primary.model(constants.Model.schoolbranch, schoolbranchesModel).findOne({ branchname, phoneno }).lean();
                                if (existing) {
                                    return responsemanager.onBadRequest({ message: 'Branchname is Already exiting' }, res);
                                }
                                let obj = {
                                    branchname: branchname,
                                    phoneno: phoneno,
                                    address: address,
                                    email: email,
                                    status: true
                                };
                                if (branchid) {
                                    if (!mongoose.Types.ObjectId.isValid(branchid)) {
                                        return responsemanager.onBadRequest({ message: 'Branchid is not valid' }, res);
                                    }
                                    let branchupdate = await primary.model(constants.Model.schoolbranch, schoolbranchesModel)
                                        .findOneAndUpdate(
                                            { _id: new mongoose.Types.ObjectId(branchid) },
                                            obj,
                                            { new: true } // optional: return updated document
                                        );
                                    return responsemanager.onSuccess({ message: 'Branch updated successfully...' }, branchupdate, res);
                                }
                            } else {
                                return responsemanager.onBadRequest({ message: 'email name is required' }, res)
                            }
                        } else {
                            return responsemanager.onBadRequest({ message: 'address name is required' }, res)
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'phoneno name is required' }, res)
                    }
                    // } else {
                    //     return responsemanager.onBadRequest({ message: 'branchcode name is required' }, res)
                    // }
                } else {
                    return responsemanager.onBadRequest({ message: 'branch name is required' }, res);
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