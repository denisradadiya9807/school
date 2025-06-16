const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const academic = new mongoose.Schema({
    academicyear: {
        type: String,
        require: true
    },
    startDate: {
        type: String,
        require: true
    },
    endDate: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});
academic.plugin(mongoosePaginate)
module.exports = academic;