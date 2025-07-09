let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
let     schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    noofinstallment: {
        type: Number,
        require: true
    }
}, { timestamps: true, strict: false, autoIndex: true });
schema.plugin(mongoosePaginate);
module.exports = schema;