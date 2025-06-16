const mongoose = require('mongoose');
const adminmodel = new mongoose.Schema({

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
    adminid: {
        type: mongoose.Types.ObjectId,
        require: true
    }
});
module.exports = adminmodel;