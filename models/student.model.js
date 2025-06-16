const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const student = new mongoose.Schema({
    Adminssion_NO: {
        type: String,
        require: true
    },
    Date_Of_Admission: {
        type: String,
        require: true
    },
    Roll_No: {
        type: String,
        require: true
    },
    classname: {
        type: String,
        require: true
    },
    section: {
        type: String,
        require: true
    },
    academicyear: {
        type: String,
        require: true
    },
        Student_Name: {
        type: String,
        require: true
    },
    Student_Mobile_No: {
        type: String,
        require: true
    },
    Student_Email: {
        type: String,
        require: true
    },
    Student_Gender: {
        type: String,
        require: true
    },
    Student_Date_Of_Birth: {
        type: String,
        require: true
    },
    Student_Blood_Group: {
        type: String,
        require: true
    },
    Student_Height: {
        type: String,
        require: true
    },
    Student_Weight: {
        type: String,
        require: true
    },
    Father_Name: {
        type: String,
        require: true
    },
    Father_Mobile_No: {
        type: String,
        require: true
    },
    Father_Email: {
        type: String,   
        require: true
    },
    Father_Occupation: {
        type: String,
        require: true
    },
    Father_Qualification: {
        type: String,
        require: true
    },
    Father_Address: {
        type: String,
        require: true
    },
    Mother_Name: {
        type: String,
        require: true
    },
    Mother_Mobile_No: {
        type: String,
        require: true
    },
    Mother_Email: {
        type: String,
        require: true
    },
    Mother_Occupation: {
        type: String,
        require: true
    },
    Mother_Qualification: {
        type: String,
        require: true
    },
    Mother_Address: {
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
    Bank_name: {
        type: String,
        require: true
    },
    Bank_Branch: {
        type: String,
        require: true
    },
    Account_No: {
        type: String,
        require: true
    },
    IFSC_Code: {
        type: String,
        require: true
    },
    Address: {
        type: String,
        require: true
    },
    Pin_code: {
        type: String,
        require: true
    },
    City: {
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
    branchid: {
        type: String,
        require: true
    }, status: {
        type: Boolean,
        require: true
    }
});
student.plugin(paginate)
module.exports = student;