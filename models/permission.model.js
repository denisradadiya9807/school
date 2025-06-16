const mongoose = require('mongoose');

let permissionmodel = new mongoose.Schema({

    Collectionname: {
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
        default: false
    },
    exports: {
        type: Boolean,
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    updatedAt: {
        type: String,
        default: Date.now,
    },

    status: {
        type: Boolean,
        default: true
    }
});
module.exports = permissionmodel;