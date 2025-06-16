var express = require('express');
var router = express.Router();
const async = require('async');
const mongoconnection = require('../../../utilities/conection');
const constants = require('../../../utilities/constants');
const helper = require('../../../utilities/helper');
const responseManager = require('../../../utilities/response.manager');
const adminmodel = require('../../../models/admin.model');
const authmodel = require('../../../models/auth.model');
const schoolmodel = require('../../../models/school.model');
const { passwordDecryptor } = require('../../../utilities/helper');
exports.login = async (req, res) => {
    const { email, password, database } = req.body;
    if (!email || !password) {
        return responseManager.onBadRequest({ message: "email and password are required" }, res);
    }
    let primary = mongoconnection.useDb(constants.school);
    console.log("11")
    let schoolData = await primary.model(constants.Model.school, schoolmodel).findOne({ database: { "$in": [database] } }).lean();
    console.log('4445', schoolData);
    // let schoolDatabase = schoolData.database;
    let secondary = mongoconnection.useDb(database);
    let adminData = await secondary.model(constants.Model.admin, adminmodel).findOne({ email: email }).lean();

    let isPasswordValid = await passwordDecryptor(adminData.password);
    // console.log("Entered password:", password);
    // console.log("Stored hashed password:", isPasswordValid);
    if (password !== isPasswordValid) {
        return responseManager.onBadRequest({ message: 'Invalid email or password' }, res);
    }
    let generateAccessToken = await helper.generateAccessToken({
        adminId: adminData._id.toString(),
        database: database,
    });
    return responseManager.onSuccess('user login successfully...', { generateAccessToken }, res);
};
