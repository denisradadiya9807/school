const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const timetable = new mongoose.Schema({
    sectionid: {
        type: String,
        require: true
    },
    boardid: {
        type: String,
        require: true
    },
    streamid: {
        type: String,
        require: true
    },
    standardid: {
        type: String,
        require: true
    },
    semesterid: {
        type: String,
        require: true
    },
    dayid: {
        type: String,
        require: true
    },
    classid: {
        type: String,
        require: true
    },
    timetable: [],

    status: {
        type: Boolean,
        require: true
    },
    subjectid: {
        type: String,

    },
    branchid: {
        type: String,
        require: true
    },
    endtime: {

    },
    starttime: {
        type: String,
    },
    end_date: {
        type: String,
    },
    start_date: {
    }
});
timetable.plugin(paginate)
module.exports = timetable;