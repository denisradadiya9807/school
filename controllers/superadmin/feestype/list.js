const mongoConnection = require('../../../utilities/conection');
const responseManager = require('../../../utilities/response.manager');
const constants = require('../../../utilities/constants');
const adminsModel = require('../../../models/admin.model');
const feetypesModel = require('../../../models/feestype.model');
const config = require('../../../utilities/config');
const mongoose = require('mongoose');
exports.list = async (req, res) => {
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        if (req.token.database && req.token.database.trim() != '') {
            let primary = mongoConnection.useDb(constants.schoolsuperadmin);
            let secondary = mongoConnection.useDb(req.token.database);
            let adminData = await secondary.model(constants.Model.admin, adminsModel).findById(req.token.adminId).lean();
            if (adminData && adminData != null && adminData.status === true) {
                let feetypesData = await primary.model(constants.supermodel.feestype, feetypesModel).find({}).lean();
                return responseManager.onSuccess('All fee type...', feetypesData, res);
            } else {
                return responseManager.unauthorisedRequest(res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
};