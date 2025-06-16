const mongoose = require('mongoose');
const authmodel = new mongoose.Schema({

    userid: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    roleid: {
        type: mongoose.Types.ObjectId,
        require: true
    }
});
module.exports = authmodel;