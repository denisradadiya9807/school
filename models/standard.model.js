const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const boardmodel = new mongoose.Schema({
    status: {
        type: Boolean,
        default: true
    },
    branchid: {
        type: String,
        require: true
    },
    standardname: {
        type: String,
        require: true
    },
    fees: {
        type: Number,
        require: true
    }
});
boardmodel.plugin(mongoosePaginate)
module.exports = boardmodel;