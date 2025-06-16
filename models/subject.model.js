var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
const subjects = new mongoose.Schema({
    branchid: {
        type: String,
        require: true
    },
    subjectname: {
        type: String,
        require: true
    },
    classid: {
        type: String,
        require: true
    },
    sectionid: {
        type: String,
        require: true
    },
    profile: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});
subjects.plugin(mongoosePaginate)
module.exports = subjects;
