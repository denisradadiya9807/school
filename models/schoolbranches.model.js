const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schoolbranchesModel = new mongoose.Schema({
    branchname: {
        type: String,
        require: true
    },
    branchcode: {
        type: String,
        require: true
    },
    schoolid: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phoneno: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});

schoolbranchesModel.plugin(mongoosePaginate);
module.exports = schoolbranchesModel;