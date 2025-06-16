// const mongoose = require('mongoose');
// const permissionmodel = require('./permission.model');

// // Define the user schema
// const rolemodel = new mongoose.Schema({
//     // username: {
//     //     type: String,
//     //     required: [true, 'Username is required'],
//     //     trim: true,
//     // },
//     // password: {
//     //     type: String,
//     //     : true,
//     //     validate: {
//     //         validator: function (value) {
//     //             // Ensure password contains at least one letter and one number
//     //             return /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
//     //         },
//     //         message: 'Password must contain at least one letter and one number',
//     //     },
//     // },
//     roleName: {
//         type: String,
//         require: true
//     },
//     status: {
//         type: String,
//         require: true
//     },
//     permissions: [permissionmodel],

// });

// module.exports = rolemodel;





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
    adminid: {
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
