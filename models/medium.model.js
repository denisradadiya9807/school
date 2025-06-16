const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const section = new mongoose.Schema({
    status: {
        type: Boolean,
        default: true
    },
    branchid: {
        type: String,
        require: true
    },
    mediumname: {
        type: String,
        require: true
    }
});
section.plugin(mongoosePaginate)
module.exports = section;