const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let permissions = new mongoose.Schema({
    displayname: {
        type: String,
        require: true
    },
    collectionname: {
        type: String,
        require: true
    },
    insertupdate: {
        type: Boolean,
        default: false
    },
    Delete: {
        type: Boolean,
        default: false
    },
    View: {
        type: Boolean,
        default: true
    },
}, { _id: false });
const roleModel = new mongoose.Schema({
    superadminid: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    // roleid: {
    //     type: mongoose.Types.ObjectId,
    //     default: ''  
    // },
    status: {
        type: Boolean,
        default: true
    },
    roleName: {
        type: String,
        require: true
    },
    permissions: [permissions],

});
roleModel.plugin(mongoosePaginate);
module.exports = roleModel;
