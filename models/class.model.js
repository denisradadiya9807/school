const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const section = new mongoose.Schema({
    sectionid: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    classname: {
        type: String,
        require: true
    },
    branchid: {
        type: String,
        require: true
    }
});
section.plugin(mongoosePaginate)
module.exports = section;