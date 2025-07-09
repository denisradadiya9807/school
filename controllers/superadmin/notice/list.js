const express = require('express');
const router = express.Router();
const constant = require('../../../utilities/constants');
const mongoconection = require('../../../utilities/conection');
const responcemanager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const adminmodel = require('../../../models/admin.model');
const noticemodel = require('../../../models/notice.model');
const mongoose = require('mongoose');
const { regex } = require('regex');

exports.list = async (req, res) => {
    const { search } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconection.useDb(req.token.database);
        let primary = mongoconection.useDb(constant.schoolsuperadmin);
        let admindata = await primary1.model(constant.Model.admin, adminmodel).findById(req.token.adminId);
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, admindata.roleid, 'notice', 'View');
            if (havepermissions) {
                let noticelist = await primary.model(constant.supermodel.notice, noticemodel).find({ title: { '$regex': new RegExp(search, "i") }, }).lean();
                return responcemanager.onSuccess('Get All Notice', noticelist, res);
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
exports.withpaginate = async (req, res) => {
    const { page, limit } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconection.useDb(req.token.database)
        let primary = mongoconection.useDb(constant.schoolsuperadmin)
        let admindata = await primary1.model(constant.Model.admin, adminmodel).findById(req.token.admin)
        if (admindata && admindata != null && admindata.status === true) {
            let havepermissions = config.getsuperadminPermission(req, admindata.roleid, 'notice', 'View')
            if (havepermissions) {
                primary.model(constant.supermodel.notice, noticemodel).paginate({}, {
                    page,
                    limit: parseInt(limit),
                    sort: { _id: -1 },
                    lean: true
                }).then((noticedata) => {
                    return responcemanager.onSuccess('holiday Data...', noticedata, res);
                }).catch((error) => {
                    return responcemanager.onError(error, res);
                })
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


