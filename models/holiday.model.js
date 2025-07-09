const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const Holiday = new mongoose.Schema({
    branchid: {
        type: String,
        require: true
    },
    holidaytitle: {
        type: String,
        require: true
    },
    startdate: {
        type: String,
        require: true
    },
    enddate: {
        type: String,
        require: true
    },
    branchid: {
        type: String,
        require: true
    },
    enddatestemp: {
    },
    fromdatestemp: {
    }
});
Holiday.plugin(paginate);
module.exports = Holiday