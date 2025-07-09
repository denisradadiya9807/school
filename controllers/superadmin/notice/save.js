const express = require('express');
const router = express.Router();
const adminmodel = require('../../../models/admin.model');
const helper = require('../../../utilities/helper');
const responcemanager = require('../../../utilities/response.manager');
const noticemodel = require('../../../models/notice.model');
const branchmodel = require('../../../models/schoolbranches.model');
const config = require('../../../utilities/config');
const constant = require('../../../utilities/constants');
const mongoconnection = require('../../../utilities/conection');
const mongoose = require('mongoose');

exports.save = async (req, res) => {
    const { title, Date, description, status, noticeid, branchid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constant.schoolsuperadmin)
        let admindata = await primary1.model(constant.Model.admin, adminmodel).findById(req.token.adminId);
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'notice', 'insertupdate');
            if (havepermissions) {
                if (title && title != '' && title != null && title != undefined) {
                    if (Date && Date != '' && Date != null && Date != undefined) {
                        if (description && description != '' && description != null && description != undefined) {
                            if (status && status != '' && status != null && status != undefined) {
                                if (!mongoose.Types.ObjectId.isValid(branchid)) {
                                    return responcemanager.onBadRequest({ message: "Branch Is Not Found" }, res);
                                }
                                let branchdata = await primary1.model(constant.Model.schoolbranch, branchmodel).find({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                                if (!branchdata) {
                                    return responcemanager.onBadRequest({ message: 'Branch Is Is Invalid...' }, res);
                                }
                                const allowedstatus = ['Send_to_Everyone', 'Send_to_All_Teachers', 'Send_to_All_Students'];
                                if (!allowedstatus.includes(status)) {
                                    return responcemanager.onBadRequest({ message: 'Status sendeveryone,allteacher,student' }, res)
                                }
                                let exitingnotice = await primary.model(constant.supermodel.notice, noticemodel).findOne({ title: title })
                                if (exitingnotice) {
                                    return responcemanager.onBadRequest({ message: "date And Notice Same Available" }, res);
                                }
                                let obj = {
                                    title: title,
                                    Date: Date,
                                    description: description,
                                    status: status,
                                    branchid: branchid
                                }
                                if (noticeid) {
                                    let updatenotice = await primary.model(constant.supermodel.notice, noticemodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(noticeid) }, obj).lean();
                                    return responcemanager.onSuccess('Notice Successfully updated', res, updatenotice);
                                } else {
                                    let noticeadd = await primary.model(constant.supermodel.notice, noticemodel).create(obj);
                                    return responcemanager.onSuccess('Notice Created Successfully...', noticeadd, res);
                                }
                            } else {
                                return responcemanager.onBadRequest({ message: "Status is inValid" })
                            }
                        } else {
                            return responcemanager.onBadRequest({ message: "Description is invalid" }, res);
                        }
                    } else {
                        return responcemanager.onBadRequest({ message: "Date Is Invalid" }, res);
                    }
                } else {
                    return responcemanager.onBadRequest({ messsage: "Title IS InValid" }, res);
                }
            } else {
                return responcemanager.accessdenied(res);
            }
        } else {
            return responcemanager.unauthorisedRequest(res);
        }
    } else {
        return responcemanager.unauthorisedRequest(res);
    }
}