const mongoose = require('mongoose');
const contactPersonSchema = new mongoose.Schema({

    contact_person_name: {
        type: String,
        require: true

    },
    contact_person_email: {
        type: String,
        require: true

    },
    contact_person_gender: {
        type: String,
        require: true

    }

});
const leadmodel = new mongoose.Schema({
    schoolname: {
        type: String,
        require: true
    },
    schoolcode: {
        type: String,
        require: true
    },
    authorizedpersonename: {
        type: String,
        require: true
    },
    email: {
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
    converttoschool: {
        type: String,
        require: true
    },
    contact_person_details: contactPersonSchema,

});

module.exports = leadmodel;