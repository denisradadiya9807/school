var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
const teacher = new mongoose.Schema({
    Teachername: {
        type: String,
        require: true
    },
    MobileNo: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Gender: {
        type: String,
        require: true
    },
    Dateofbirth: {
        type: String,
        require: true
    },
    Maritalstatus: {
        type: String,
        require: true
    },
    joiningdate: {
        type: String,
        require: true
    },
    Nationality: {
        type: String,
        require: true
    },
    Religion: {
        type: String,
        require: true
    },
    cast: {
        type: String,
        require: true
    },
    Lastorganizationname: {
        type: String,
        require: true
    },
    Lastjobposition: {
        type: String,
        require: true
    },
    Experience: {
        type: String,
        require: true
    },
    Qualification: [],
    Address: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    State: {
        type: String,
        require: true
    },
    Country: {
        type: String,
        require: true
    },
    BankName: {
        type: String,
        require: true
    },
    BankBranch: {
        type: String,
        require: true
    },
    AccountNo: {
        type: String,
        require: true
    },
    IFSCCode: {
        type: String,
        require: true
    },
    Desgination: {
        type: String,
        require: true
    },
    Teacherphoto: {
        type: String,
        require: true
    },
    classid: {
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
    }

});
teacher.plugin(mongoosePaginate);
module.exports = teacher;