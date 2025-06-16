const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { status } = require('../controllers/superadmin/subject/status');
const section = new mongoose.Schema({
    section: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    branchid: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});
section.plugin(mongoosePaginate)
module.exports = section;