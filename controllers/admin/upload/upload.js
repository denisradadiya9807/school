const mongoose = require('mongoose');
const constants = require('../../../utilities/constants');
const mongoConnection = require('../../../utilities/conection');
const responseManager = require('../../../utilities/response.manager');
const adminModel = require('../../../models/admin.model');

exports.upload = async (req, res) => {
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary = mongoConnection.useDb(constants.school);
        const adminData = await primary.model(constants.Model.admin, adminModel).findById(req.token.adminId).lean();
        if (adminData && adminData.status === true) {
            if (req.file) {
                return responseManager.onSuccess('File uploaded successfully!', {
                    filename: req.file.filename,
                    path: 'images/' + req.file.filename,
                }, res);    
            } else {
                return responseManager.onBadRequest({ message: 'No file uploaded.' }, res);
            }
        } else {
            return responseManager.unauthorisedRequest(res);
        }
    } else {
        return responseManager.unauthorisedRequest(res);
    }
}