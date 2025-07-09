const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const examtypemodel = mongoose.Schema({

    examtypeid: {
        type: String,
        require: true
    },
    branchid: {
        type: String,
        require: true
    },
    ExamType: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
});
examtypemodel.plugin(paginate);
module.exports = examtypemodel;