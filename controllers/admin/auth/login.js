var express = require('express');
var router = express.Router();
const async = require('async');
const mongoose = require('mongoose');
const mongoconection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
const helper = require('../../../utilities/helper');
const responseManager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model');
exports.login = async (req, res) => {
    const { userid, password } = req.body;
    // console.log("req.token", req.body);
    // if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
    let primary = mongoconection.useDb(constants.school);
    // let adminData = await primary.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
    // if (adminData && adminData != null && adminData.status === true) {
    let adminData = await primary.model(constants.Model.admin, adminmodel).findOne({ userid: userid }).lean();
    // if (adminData && adminData != null && adminData.status === true) {
    if (userid && userid != '' && userid != null && userid != undefined) {
        if (password && password != '' && password != null && password != undefined) {
            let decryptPassword = await helper.passwordDecryptor(adminData.password);
            if (password == decryptPassword) {
                let generateAccessToken = await helper.generateAccessToken({ adminId: adminData._id.toString() });
                let Data = {
                    accessToken: generateAccessToken
                };
                return responseManager.onSuccess('user login sussefully...', Data, res);
            } else {
                return responseManager.onBadRequest({ message: 'invalid password please enter valid password..!' }, res);
            }
        } else {
            return responseManager.onBadRequest({ message: 'invalid password please enter valid password...1' }, res);
        }
    } else {
        return responseManager.onBadRequest({ message: 'invalid user id please enter valid user id .....!' }, res);
    }
};
// } else {
//     return responseManager.unauthorisedRequest(res);
// }
// // } else {
//     return responseManager.unauthorisedRequest(res);
// }};




