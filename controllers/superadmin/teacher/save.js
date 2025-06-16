var express = require('express');
var router = express.Router();
var adminmodel = require('../../../models/admin.model');
var teachermodel = require('../../../models/teacher.model');
var config = require('../../../utilities/config');
const constants = require('../../../utilities/constants');
var mongoconnection = require('../../../utilities/conection');
var mongoose = require('mongoose');
var responsemanager = require('../../../utilities/response.manager');
var classmodel = require('../../../models/class.model');
var schoolbranchmodel = require('../../../models/schoolbranches.model');

exports.save = async (req, res) => {
    const { Teacherphoto, Teachername, MobileNo, Email, Dateofbirth, Maritalstatus, joiningdate, Nationality, Religion, cast, Lastorganizationname,
        Qualifications, status, branchid,
        Lastjobposition, Experience, Qualification, College, Passingyear, Address, pincode, city, State, Country, BankName, BankBranch, AccountNo,
        IFSCCode, Desgination, teacherid, classid, Gender } = req.body;
    if (req.token && new mongoose.Types.ObjectId(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admin = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admin && admin != null && admin.status === true) {
            let havepermission = await config.getsuperadminPermission(req, admin.roleid, 'teacher', 'insertupdate');
            if (havepermission) {
                if (Teachername && Teachername != '' && Teachername != null && Teachername != undefined) {
                    if (MobileNo && MobileNo != '' && MobileNo != null && MobileNo != undefined) {
                        if (Email && Email != '' && Email != null && Email != undefined) {
                            if (Gender && Gender != '' && Gender != null && Gender != undefined) {
                                if (Dateofbirth && Dateofbirth != '' && Dateofbirth != null && Dateofbirth != undefined) {
                                    if (Maritalstatus && Maritalstatus != '' && Maritalstatus != null && Maritalstatus != undefined) {
                                        if (joiningdate && joiningdate != '' && joiningdate != null && joiningdate != undefined) {
                                            let exiting = await primary.model(constants.supermodel.teacher, teachermodel).findOne({ MobileNo: MobileNo, Email: Email }).lean();
                                            if (exiting) {
                                                return responsemanager.onBadRequest({ message: "Teacher Mobile No Already Exits..." }, res);
                                            }

                                            if (!new mongoose.Types.ObjectId(classid)) {
                                                return responsemanager.onBadRequest({ message: "Class Id Is Invalids" }, res);
                                            }
                                            let classs = await primary.model(constants.supermodel.class, classmodel).findOne({ _id: new mongoose.Types.ObjectId(classid) }).lean();
                                            if (!classs) {
                                                return responsemanager.onBadRequest({ message: 'classid is not found' }, res);
                                            }
                                            const schoolBranch = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel)
                                                .findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                                            if (!schoolBranch) {
                                                return responsemanager.onBadRequest({ message: 'Branch not found with given ID' }, res);
                                            }
                                            let branch = await primary1.model(constants.Model.schoolbranch, schoolbranchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                                            if (!branch) {
                                                return responsemanager.onBadRequest({ message: 'branch is not valid' }, res);
                                            }
                                            let imagepath = '';
                                            if (req.file) {
                                                imagepath = 'images/' + req.file.filename;
                                            }
                                            let  Qualifications = [{
                                                Qualification: Qualification,
                                                College: College,
                                                Passingyear: Passingyear
                                            }];


                                            const obj = {
                                                Teachername: Teachername,
                                                MobileNo: MobileNo,
                                                Email: Email,
                                                Gender: Gender,
                                                Dateofbirth: Dateofbirth,
                                                Maritalstatus: Maritalstatus,
                                                joiningdate: joiningdate,
                                                Nationality: Nationality,
                                                Religion: Religion,
                                                cast: cast,
                                                Lastorganizationname: Lastorganizationname,
                                                Lastjobposition: Lastjobposition,
                                                Experience: Experience,
                                                Qualification: Qualifications,
                                                Address: Address,
                                                pincode: pincode,
                                                city: city,
                                                State: State,
                                                Country: Country,
                                                BankName: BankName,
                                                BankBranch: BankBranch,
                                                AccountNo: AccountNo,
                                                IFSCCode: IFSCCode,
                                                Desgination: Desgination,
                                                Teacherphoto: imagepath,
                                                classid: classid,
                                                status: true,
                                                branchid: branchid
                                            }
                                            if (teacherid) {
                                                let teacher = await primary.model(constants.supermodel.teacher, teachermodel).findOneAndUpdate({ _id: new mongoose.Types.ObjectId(teacherid) }).lean();
                                                return responsemanager.onSuccess('Teacher Data Update Successfully...', teacher, res);
                                            } else {
                                                let teacheradd = await primary.model(constants.supermodel.teacher, teachermodel).create(obj);
                                                return responsemanager.onSuccess('Teacher Data Add Sucessfully', teacheradd, res);
                                            }
                                        } else {
                                            return responsemanager.onBadRequest({ message: 'joiningdate Is Not Defined' });
                                        }

                                    } else {
                                        return responsemanager.onBadRequest({ message: 'Maritalstatus Is Not Defined' });
                                    }

                                } else {
                                    return responsemanager.onBadRequest({ message: 'Dateofbirth Is Not Defined' });
                                }

                            } else {
                                return responsemanager.onBadRequest({ message: 'Gender Is Not Defined' });
                            }

                        } else {
                            return responsemanager.onBadRequest({ message: 'Email Is Not Defined' });
                        }

                    } else {
                        return responsemanager.onBadRequest({ message: 'MobileNo Is Not Defined' });
                    }

                } else {
                    return responsemanager.onBadRequest({ message: 'Teachername Is Not Defined' });
                }

            } else {
                return responsemanager.accessdenied(res);
            }
        } else {
            return responsemanager.unauthorisedRequest(res);
        }

    } else {
        return responsemanager.unauthorisedRequest(res);
    }
}