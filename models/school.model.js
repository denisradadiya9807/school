const mongoose = require('mongoose');
const schoolmodel = new mongoose.Schema({
    schoolname: {
        type: String,
        require: true
    },
    schooladminname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    schoolcode: {
        type: String,
        require: true
    },
    phoneno: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    totabranch: {
        type: String,
        require: true
    },
    totalstudents: {
        type: String,
        require: true
    },
    totalteachers: {
        type: String,
        require: true
    },
    leadid: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        require: true
    },
    database: []
});
module.exports = schoolmodel;