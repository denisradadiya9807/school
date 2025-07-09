const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const section = new mongoose.Schema({
    title: {
        require: true,
        type: String
    },
    Date: {
        require: true,
        type: String
    },
    description: {
        require: true,
        type: String
    },
    status: {
        type: String,
        enum: ['Send_to_Everyone', 'Send_to_All_Teachers', 'Send_to_All_Students'],
        require: true
    },
    branchid: {
        require: true,
        type: String
    }
})

section.plugin(mongoosePaginate);
module.exports = section;
