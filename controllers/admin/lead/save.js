var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongoconnection = require('../../../utilities/conection');
const constant = require('../../../utilities/constants');
const leadmodel = require('../../../models/lead.model');
const adminmodel = require('../../../models/admin.model');
const config = require('../../../utilities/config');
const responseManager = require('../../../utilities/response.manager');
const roleModel = require('../../../models/role.model');

exports.save = async (req, res) => {

    const { leadid, schoolname, authorizedpersonename, email, phoneno, address, totalbranch, totalstudents, totalteachers, schoolcode } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoconnection.useDb(constant.school);
        let adminData = await primary.model(constant.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != '' && adminData.status === true) {
            let getpermission = await config.getadminPermission(adminData.roleid, 'lead', 'insertupdate');
            if (getpermission) {
                if (schoolname && schoolname != '' && schoolname != null && schoolname != undefined) {
                    if (authorizedpersonename && authorizedpersonename != '' && authorizedpersonename != null && authorizedpersonename != undefined) {
                        if (email && email != null && email != null && email != undefined) {
                            if (phoneno && phoneno != '' && phoneno != null && phoneno != undefined) {
                                if (address && address != '' && address != null && address != undefined) {
                                    if (totalbranch && totalbranch != '' && totalbranch != null && totalbranch != undefined) {
                                        if (totalstudents && totalstudents != '' && totalstudents != null && totalstudents != undefined) {
                                            if (totalteachers && totalteachers != '', totalteachers != null && totalteachers != undefined) {
                                                if (schoolcode && schoolcode != '' && schoolcode != null && schoolcode != undefined) {
                                                    // if (leadid && leadid != '' && leadid != null && leadid != undefined && mongoose.Types.ObjectId.isValid(leadid)) {

                                                    const existingProduct = await primary.model(constant.Model.lead, leadmodel).findOne({
                                                        schoolname, phoneno
                                                    });
                                                    if (existingProduct && (!leadid || existingProduct._id.toString() !== leadid)) {
                                                        return res.status(400).json({ message: 'Schoolname already exists. Please use a different  mobile no.' });
                                                    }

                                                    const schoolcode1 = await primary.model(constant.Model.lead, leadmodel).findOne({ schoolcode });
                                                    if (schoolcode1) {
                                                        return res.status(400).json({ message: "School code already exists. Lead not saved." });
                                                    }

                                                    let obj = {
                                                        schoolcode: schoolcode,
                                                        schoolname: schoolname,
                                                        authorizedpersonename: authorizedpersonename,
                                                        email: email,
                                                        phoneno: phoneno,
                                                        address: address,
                                                        totalbranch: totalbranch,
                                                        totalstudents: totalstudents,
                                                        totalteachers: totalteachers
                                                    };
                                                    if (leadid) {
                                                        leadupdate = await primary.model(constant.Model.lead, leadmodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(leadid) }, obj);
                                                        if (!leadupdate) {
                                                            return responseManager.onBadRequest({ message: 'Lead id Not found or authorised update' }, res);
                                                        }
                                                        return responseManager.onSuccess('data is updated is successfully...', leadupdate, res);
                                                    } else {
                                                        let leadsave = await primary.model(constant.Model.lead, leadmodel).create(obj);
                                                        return responseManager.onSuccess('Lead data save successfully...', leadsave, res);
                                                    }
                                                    // } else {
                                                    //     return responseManager.onBadRequest({ message: 'user already exist' }, res);
                                                    // }
                                                } else {
                                                    return responseManager.onBadRequest({ message: 'Schoolcode Is required' });
                                                }
                                            } else {
                                                return responseManager.onBadRequest({ message: 'totalteachers required' }, res);
                                            }
                                        } else {
                                            return responseManager.onBadRequest({ message: "totalstudents required" }, res);
                                        }

                                    } else {
                                        return responseManager.onBadRequest({ message: 'totalbrach is required' }, res);
                                    }

                                } else {
                                    return responseManager.onBadRequest({ message: 'address is required' }, res);
                                }

                            } else {
                                return responseManager.onBadRequest({ message: 'phoneno is required' }, res);
                            }
                        } else {
                            return responseManager.onBadRequest({ message: 'email is required' }, res);
                        }
                    } else {
                        return responseManager.onBadRequest({ message: 'authorishedpersonal name is Require' }, res);
                    }

                } else {
                    return responseManager.onBadRequest({ message: ' School name is required' }, res);
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