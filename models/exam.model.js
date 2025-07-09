const mongoose = require('mongoose');
const mongoosepaginate = require('mongoose-paginate-v2');
let exam = mongoose.Schema({

    ExamType: {
        type: String,
        require: true
    }, section: {
        type: String,
        require: true
    }, board: {
        type: String,
        require: true
    }, semester: {
        type: String,
        require: true
    }, standard: {
        type: String,
        require: true
    }, stream: {
        type: String,
        require: true
    }, classs: {
        type: String,
        require: true
    }, branch: {
        type: String,
        require: true
    }

});
exam.plugin(mongoosepaginate);
module.exports = exam