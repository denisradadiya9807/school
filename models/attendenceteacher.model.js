const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const attened = new mongoose.Schema({
    branchid: {
        type: String,
    },
    classid: {
        type: String,
    },
    teacherid: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave', 'Halfleave'],
        required: true
    },
    date: {
        type: String,
        require: true
    }

});
attened.plugin(paginate)
module.exports = attened;   