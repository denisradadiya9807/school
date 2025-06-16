var express = require('express');
var router = express.Router();
var mongoconnection = require('../../../utilities/conection');
var constants = require('../../../utilities/constants');
var config = require('../../../utilities/config');
var responseManager = require('../../../utilities/response.manager');
var mongoose = require('mongoose');
const adminmodel = require('../../../models/admin.model');
const classmodel = require('../../../models/class.model');

exports.delete = async (req, res) => {
    const { classid } = req.body
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let classs = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (classs && classs != null && classs.status === true) {
            let havepermissions = await config.getsuperadminPermission(req, classs.roleid, 'class', 'Delete');
            if (havepermissions) {
                let abc = await primary.model(constants.supermodel.class, classmodel).findOneAndDelete({ _id: new mongoose.Types.ObjectId(classid) }).lean();
                if (abc) {
                    return responseManager.onSuccess('Class Delete Successfully...', abc, res);
                } else {
                    return responseManager.onBadRequest({ message: 'Check Class ID anable delete this class..' }, res);
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


