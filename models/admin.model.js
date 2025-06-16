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
    roleid: {
        type: String,
        require: true
    },
    accessallbranch: {
        type: Boolean,
        require: true
    },
    accessbranches: {
        type: [String],
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }

});
module.exports = adminmodel;