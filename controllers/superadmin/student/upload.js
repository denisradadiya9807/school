let mongoose = require('mongoose');
let constants = require('../../../utilities/constants');
let mongoConnection = require('../../../utilities/conection');
const responseManager = require('../../../utilities/response.manager');
const config = require('../../../utilities/config');
const multer = require('../../../utilities/multer');
const adminmodel = require('../../../models/admin.model');

exports.upload = async (req, res) => {  
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        const primary1 = mongoConnection.useDb(req.token.database);
        const adminData = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (adminData && adminData != '' && adminData.status === true) {
            let havepermission = await config.getsuperadminPermission(req, adminData.roleid, 'student', 'insertupdate');
            if (havepermission) {
                if (req.file) {
                    return responseManager.onSuccess('File Upload Successfully...', {
                        filename: req.file.filename,
                        path: '/image/' + req.file.filename,
                    }, res);
                } else {
                    return responseManager.onBadRequest({ message: 'No File Upload' }, res);
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