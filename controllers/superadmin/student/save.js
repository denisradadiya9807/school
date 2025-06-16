var express = require('express');
var router = express.Router();
var mongoconnection = require('../../../utilities/conection');
var constants = require('../../../utilities/constants');
var config = require('../../../utilities/config');
var mongoose = require('mongoose');
var adminmodel = require('../../../models/admin.model');
var classmodel = require('../../../models/class.model');
var sectionmodel = require('../../../models/section.model');
var academicyearmodel = require('../../../models/addacademicyear.model');
var studentmodel = require('../../../models/student.model')
var branchmodel = require('../../../models/schoolbranches.model');
var responsemanager = require('../../../utilities/response.manager');

exports.save = async (req, res) => {
    const { Adminssion_NO, Date_Of_Admission, Roll_No, classname, section, academicyear, Student_Name, Student_Mobile_No, Student_Email, Student_Gender, Student_Date_Of_Birth,
        Student_Blood_Group, Student_Height, Student_Weight, Father_Name, Father_Mobile_No, Father_Email, Father_Occupation, Father_Qualification, Father_Address, Mother_Name,
        Mother_Mobile_No, Mother_Email, Mother_Occupation, Mother_Qualification, Mother_Address, Nationality, Religion, cast, Bank_Branch, Account_No, IFSC_Code, Address, City, studentid,
        State, Country, branchid } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoconnection.useDb(req.token.database);
        let primary = mongoconnection.useDb(constants.schoolsuperadmin);
        let admindata = await primary1.model(constants.Model.admin, adminmodel).findById(req.token.adminId).lean();
        if (admindata && admindata != null && admindata.status === true) {
            let havepermission = await config.getsuperadminPermission(req, admindata.roleid, 'student', 'insertupdate')
            if (havepermission) {
                if (Adminssion_NO && Adminssion_NO != '' && Adminssion_NO != null && Adminssion_NO != undefined) {
                    if (Date_Of_Admission && Date_Of_Admission != '' && Date_Of_Admission != null && Date_Of_Admission != undefined) {
                        if (Roll_No && Roll_No != '' && Roll_No != null && Roll_No != undefined) {
                            if (classname && classname != '' && classname != null && classname != undefined) {
                                if (section && section != '' && section != null && section != undefined) {
                                    if (academicyear && academicyear != '' && academicyear != null && academicyear != undefined) {
                                        if (Student_Blood_Group && Student_Blood_Group != '' && Student_Blood_Group != null && Student_Blood_Group != undefined) {
                                            if (Student_Date_Of_Birth && Student_Date_Of_Birth != '' && Student_Date_Of_Birth != null && Student_Date_Of_Birth != undefined) {
                                                if (Student_Email && Student_Email != '' && Student_Email != null && Student_Email != undefined) {
                                                    if (Student_Gender && Student_Gender != '' && Student_Gender != null && Student_Gender != undefined) {
                                                        if (Student_Height && Student_Height != '' && Student_Height != null && Student_Height != undefined) {
                                                            if (Student_Mobile_No && Student_Mobile_No != '' && Student_Mobile_No != null && Student_Mobile_No != undefined) {
                                                                if (Student_Name && Student_Name != '' && Student_Name != null && Student_Name != undefined) {
                                                                    if (Student_Weight && Student_Weight != '' && Student_Weight != null && Student_Weight != undefined) {
                                                                        if (Father_Address && Father_Address != '' && Father_Address != null && Father_Address != undefined) {
                                                                            if (Father_Email && Father_Email != '' && Father_Email != null && Father_Email != undefined) {
                                                                                if (Father_Mobile_No && Father_Mobile_No != '' && Father_Mobile_No != null && Father_Mobile_No != undefined) {
                                                                                    if (Father_Name && Father_Name != '' && Father_Name != null && Father_Name != undefined) {
                                                                                        if (Father_Occupation && Father_Occupation != '' && Father_Occupation != null && Father_Occupation != undefined) {
                                                                                            if (Father_Qualification && Father_Qualification != '' && Father_Qualification != null && Father_Qualification != undefined) {
                                                                                                if (Father_Address && Father_Address != '' && Father_Address != null && Father_Address != undefined) {
                                                                                                    if (Mother_Name && Mother_Name != '' && Mother_Name != null && Mother_Name != undefined) {
                                                                                                        if (Mother_Mobile_No && Mother_Mobile_No != '' && Mother_Mobile_No != null && Mother_Mobile_No != undefined) {
                                                                                                            if (Mother_Email && Mother_Email != '' && Mother_Email != null && Mother_Email != undefined) {
                                                                                                                if (Mother_Occupation && Mother_Occupation != '' && Mother_Occupation != null && Mother_Occupation != undefined) {
                                                                                                                    if (Mother_Qualification && Mother_Qualification != '' && Mother_Qualification != null && Mother_Qualification != undefined) {
                                                                                                                        if (Mother_Address && Mother_Address != '' && Mother_Address != null && Mother_Address != undefined) {
                                                                                                                            if (Nationality && Nationality != '' && Nationality != null && Nationality != undefined) {
                                                                                                                                if (Religion && Religion != '' && Religion != null && Religion != undefined) {
                                                                                                                                    if (cast && cast != '' && cast != null && cast != undefined) {
                                                                                                                                        if (Bank_Branch && Bank_Branch != '' && Bank_Branch != null && Bank_Branch != undefined) {
                                                                                                                                            if (Account_No && Account_No != '' && Account_No != null && Account_No != undefined) {
                                                                                                                                                if (IFSC_Code && IFSC_Code != '' && IFSC_Code != null && IFSC_Code != undefined) {
                                                                                                                                                    if (Address && Address != '' && Address != null && Address != undefined) {
                                                                                                                                                        if (City && City != '' && City != null && City != undefined) {
                                                                                                                                                            if (State && State != '' && State != null && State != undefined) {
                                                                                                                                                                if (Country && Country != '' && Country != null && Country != undefined) {
                                                                                                                                                                    let duplicateQuery = { Adminssion_NO: Adminssion_NO };
                                                                                                                                                                    if (studentid) {
                                                                                                                                                                        duplicateQuery._id = { $ne: new mongoose.Types.ObjectId(studentid) };
                                                                                                                                                                    }
                                                                                                                                                                    let exiting = await primary.model(constants.supermodel.student, studentmodel)
                                                                                                                                                                        .findOne(duplicateQuery)
                                                                                                                                                                        .lean();

                                                                                                                                                                    if (exiting) {
                                                                                                                                                                        return responsemanager.onBadRequest({ message: 'Student Data Already Exists...' }, res);
                                                                                                                                                                    }
                                                                                                                                                                    let classs = await primary.model(constants.supermodel.class, classmodel).findOne({ classname: classname }).lean();
                                                                                                                                                                    if (!classs) {
                                                                                                                                                                        return responsemanager.onBadRequest({ message: 'Class Name Not Found' }, res);
                                                                                                                                                                    }
                                                                                                                                                                    let sections = await primary.model(constants.supermodel.section, sectionmodel).findOne({ section: section }).lean();
                                                                                                                                                                    if (!sections) {
                                                                                                                                                                        return responsemanager.onBadRequest({ message: 'section Is Not Found' }, res);
                                                                                                                                                                    }
                                                                                                                                                                    let acedemicyear = await primary.model(constants.supermodel.academicyear, academicyearmodel).findOne({ academicyear: academicyear }).lean();
                                                                                                                                                                    if (!acedemicyear) {
                                                                                                                                                                        return responsemanager.onBadRequest({ message: 'Academic year not found' }, res);
                                                                                                                                                                    }

                                                                                                                                                                    let schoolBranch = await primary1.model(constants.Model.schoolbranch, branchmodel).findOne({ _id: new mongoose.Types.ObjectId(branchid) }).lean();
                                                                                                                                                                    if (!schoolBranch) {
                                                                                                                                                                        return responsemanager.onBadRequest({ message: 'branch is not found   ' }, res);
                                                                                                                                                                    }
                                                                                                                                                                    let obj = {
                                                                                                                                                                        Adminssion_NO: Adminssion_NO,
                                                                                                                                                                        Date_Of_Admission: Date_Of_Admission,
                                                                                                                                                                        Roll_No: Roll_No,
                                                                                                                                                                        classname: classname,
                                                                                                                                                                        section: section,
                                                                                                                                                                        academicyear: academicyear,
                                                                                                                                                                        Student_Name: Student_Name,
                                                                                                                                                                        Student_Mobile_No: Student_Mobile_No,
                                                                                                                                                                        Student_Email: Student_Email,
                                                                                                                                                                        Student_Gender: Student_Gender,
                                                                                                                                                                        Student_Date_Of_Birth: Student_Date_Of_Birth,
                                                                                                                                                                        Student_Blood_Group: Student_Blood_Group,
                                                                                                                                                                        Student_Height: Student_Height,
                                                                                                                                                                        Student_Weight: Student_Weight,
                                                                                                                                                                        Father_Name: Father_Name,
                                                                                                                                                                        Father_Mobile_No: Father_Mobile_No,
                                                                                                                                                                        Father_Email: Father_Email,
                                                                                                                                                                        Father_Occupation: Father_Qualification,
                                                                                                                                                                        Father_Qualification: Father_Qualification,
                                                                                                                                                                        Father_Address: Father_Address,
                                                                                                                                                                        Mother_Name: Mother_Name,
                                                                                                                                                                        Mother_Mobile_No: Mother_Mobile_No,
                                                                                                                                                                        Mother_Email: Mother_Email,
                                                                                                                                                                        Mother_Occupation: Mother_Occupation,
                                                                                                                                                                        Mother_Qualification: Mother_Qualification,
                                                                                                                                                                        Mother_Address: Mother_Address,
                                                                                                                                                                        Nationality: Nationality,
                                                                                                                                                                        Religion: Religion,
                                                                                                                                                                        cast: cast,
                                                                                                                                                                        Bank_Branch: Bank_Branch,
                                                                                                                                                                        Account_No: Account_No,
                                                                                                                                                                        IFSC_Code: IFSC_Code,
                                                                                                                                                                        Address: Address,
                                                                                                                                                                        City: City,
                                                                                                                                                                        State: State,
                                                                                                                                                                        Country: Country,
                                                                                                                                                                        branchid: branchid,
                                                                                                                                                                        status: true
                                                                                                                                                                    }
                                                                                                                                                                    if (studentid) {
                                                                                                                                                                        let studentupdate = await primary.model(constants.supermodel.student, studentmodel).findOneAndUpdate(
                                                                                                                                                                            { _id: new mongoose.Types.ObjectId(studentid) },
                                                                                                                                                                        );
                                                                                                                                                                        return responsemanager.onSuccess('Student Data updated successfully...', studentupdate, res);
                                                                                                                                                                    } else {
                                                                                                                                                                        let studentcreate = await primary.model(constants.supermodel.student, studentmodel).create(obj);
                                                                                                                                                                        return responsemanager.onSuccess('Student Data Created Successfully...', studentcreate, res);
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    return responsemanager.onBadRequest({ message: 'Country Is Not valid...' })
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                return responsemanager.onBadRequest({ message: 'State Is Not valid...' })
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            return responsemanager.onBadRequest({ message: 'City Is Not valid...' })
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        return responsemanager.onBadRequest({ message: 'Address Is Not valid...' })
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    return responsemanager.onBadRequest({ message: 'IFSC_Code Is Not valid...' })
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                return responsemanager.onBadRequest({ message: 'Account_No Is Not valid...' })
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            return responsemanager.onBadRequest({ message: 'Bank_Branch Is Not valid...' })
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        return responsemanager.onBadRequest({ message: 'cast Is Not valid...' })
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    return responsemanager.onBadRequest({ message: 'Religion Is Not valid...' })
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                return responsemanager.onBadRequest({ message: 'Nationality Is Not valid...' })
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            return responsemanager.onBadRequest({ message: 'Mother_Address Is Not valid...' })
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        return responsemanager.onBadRequest({ message: 'Mother_Qualification Is Not valid...' })
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    return responsemanager.onBadRequest({ message: 'Mother_Occupation Is Not valid...' })
                                                                                                                }
                                                                                                            } else {
                                                                                                                return responsemanager.onBadRequest({ message: 'Mother_Email Is Not valid...' })
                                                                                                            }
                                                                                                        } else {
                                                                                                            return responsemanager.onBadRequest({ message: 'Mother_Mobile_No Is Not valid...' })
                                                                                                        }
                                                                                                    } else {
                                                                                                        return responsemanager.onBadRequest({ message: 'Mother_Name Is Not valid...' })
                                                                                                    }
                                                                                                } else {
                                                                                                    return responsemanager.onBadRequest({ message: 'Father_Address Is Not valid...' })
                                                                                                }
                                                                                            } else {
                                                                                                return responsemanager.onBadRequest({ message: 'Father_Qualification Is Not valid...' })
                                                                                            }
                                                                                        } else {
                                                                                            return responsemanager.onBadRequest({ message: 'Father_Occupation Is Not valid...' })
                                                                                        }
                                                                                    } else {
                                                                                        return responsemanager.onBadRequest({ message: 'Father_Name Is Not valid...' })
                                                                                    }
                                                                                } else {
                                                                                    return responsemanager.onBadRequest({ message: 'Father_Mobile_No Is Not valid...' })
                                                                                }
                                                                            } else {
                                                                                return responsemanager.onBadRequest({ message: 'Father_Email Is Not valid...' })
                                                                            }
                                                                        } else {
                                                                            return responsemanager.onBadRequest({ message: 'Father_Address Is Not valid...' })
                                                                        }
                                                                    } else {
                                                                        return responsemanager.onBadRequest({ message: 'Student_Weight Is Not valid...' })
                                                                    }
                                                                } else {
                                                                    return responsemanager.onBadRequest({ message: 'Student_Name Is Not valid...' })
                                                                }
                                                            } else {
                                                                return responsemanager.onBadRequest({ message: 'Student_Mobile_No Is Not valid...' })
                                                            }
                                                        } else {
                                                            return responsemanager.onBadRequest({ message: 'Student_Height Is Not valid...' })
                                                        }
                                                    } else {
                                                        return responsemanager.onBadRequest({ message: 'Student_Gender Is Not valid...' })
                                                    }
                                                } else {
                                                    return responsemanager.onBadRequest({ message: 'Student_Email Is Not valid...' })
                                                }
                                            } else {
                                                return responsemanager.onBadRequest({ message: 'Student_Date_Of_Birth Is Not valid...' })
                                            }
                                        } else {
                                            return responsemanager.onBadRequest({ message: 'Student_Blood_Group Is Not valid...' })
                                        }
                                    } else {
                                        return responsemanager.onBadRequest({ message: 'academicyear Is Not valid...' })
                                    }
                                } else {
                                    return responsemanager.onBadRequest({ message: 'section Is Not valid...' })
                                }
                            } else {
                                return responsemanager.onBadRequest({ message: 'classname Is Not valid...' })
                            }
                        } else {
                            return responsemanager.onBadRequest({ message: 'Roll_No Is Not valid...' })
                        }
                    } else {
                        return responsemanager.onBadRequest({ message: 'Date_Of_Admission Is Not valid...' })
                    }
                } else {
                    return responsemanager.onBadRequest({ message: 'Admission_No Is Not valid...' })
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

