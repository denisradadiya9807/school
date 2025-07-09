const mongoConnection = require('../utilities/conection');
const constants = require("../utilities/constants");
const roleModel = require('../models/role.model');
const superroleModel = require('../models/superrole.model');
const permissionmodel = require('../models/permission.model');
const mongoose = require('mongoose');
const _ = require('lodash');
const adminmodel = require('../models/admin.model');

let getadmincollection = [
    { text: 'admin', value: 'admin' },
    { text: 'role', value: 'role' },
    { text: 'lead', value: 'lead' },
    { text: 'school', value: 'school' },
]
let getsuperadmincollection = [
    { text: 'auth', value: 'auth' },
    { text: 'role', value: 'role' },
    { text: 'academicyear', value: 'academicyear' },
    { text: 'branch', value: 'branch' },
    { text: 'section', value: 'section' },
    { text: 'class', value: 'class' },
    { text: 'subject', value: 'subject' },
    { text: 'student', value: 'student' },
    { text: 'teacher', value: 'teacher' },
    { text: 'board', value: 'board' },
    { text: 'day', value: 'day' },
    { text: 'medium', value: 'medium' },
    { text: 'semester', value: 'semester' },
    { text: 'standard', value: 'standard' },
    { text: 'stream', value: 'stream' },
    { text: 'timetable', value: 'timetable' },
    { text: 'attendancestudent', value: 'attendancestudent' },
    { text: 'attendanceteacher', value: 'attendanceteacher' },
    { text: 'holiday', value: 'holiday' },
    { text: 'examtype', value: 'examtype' },
    { text: 'exam', value: 'exam' },
    { text: 'fees', value: 'fees' },
    { text: 'notice', value: 'notice' },
]
async function getadminPermission(roleid, modelName, permissionType) {
    let primary = mongoConnection.useDb(constants.school);
    let result = await primary.model(constants.Model.role, superroleModel).findById(roleid).lean();

    if (result && result.status && result.status == true) {
        let finalpermission = [];
        finalpermission = _.filter(result.permissions, { 'collectionname': modelName });
        // console.log("collection name->", collectionname);

        if (finalpermission.length == 1) {
            if (permissionType == "View") {
                if (finalpermission[0].View == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "insertupdate") {
                if (finalpermission[0].insertupdate == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "Delete") {
                if (finalpermission[0].Delete == true)
                    return true;
                else
                    return false;
            }
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
async function getsuperadminPermission(req, roleid, modelName, permissionType) {
    // const { database } = req.body;
    const db = mongoConnection.useDb(req.token.database);
    // console.log('111', req.token.database);  
    let result = await db.model(constants.Model.role, superroleModel).findById(roleid).lean();
    // let result = await db.collection('roles').findOne({ _id: new mongoose.Types.ObjectId(roleid) }, { projection: { _id: 0, roleid: 1 } });
    // console.log('222', result);
    if (result && result.status && result.status == true) {
        let finalpermission = [];
        finalpermission = _.filter(result.permissions, { 'collectionname': modelName });
        // console.log('Permissions:', result.permissions);
        if (finalpermission.length == 1) {
            if (permissionType == "View") {
                if (finalpermission[0].View == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "insertupdate") {
                if (finalpermission[0].insertupdate == true)
                    return true;
                else
                    return false;
            }
            if (permissionType == "Delete") {
                if (finalpermission[0].Delete == true)
                    return true;
                else
                    return false;
            }
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
module.exports = { getadmincollection, getadminPermission, getsuperadmincollection, getsuperadminPermission };