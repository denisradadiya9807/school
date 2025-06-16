const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const sem = new mongoose.Schema({
    status: {
        type: Boolean,
        default: true
    },
    branchid: {
        type: String,
        require: true
    },
    nameofsemester: {
        type: String,
        require: true
    }
});
sem.plugin(mongoosePaginate)

module.exports = sem;