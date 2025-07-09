const mongoConnection = require('../../../utilities/conection');
const responseManager = require('../../../utilities/response.manager');
const constants = require('../../../utilities/constants');
const adminsModel = require('../../../models/admin.model');
const feetypesModel = require('../../../models/feestype.model');
const timecalculationhelper = require('../../../utilities/timecalculation');
const config = require('../../../utilities/config');
const mongoose = require('mongoose');
const async = require('async');
exports.withoutPagination = async (req, res) => {
    let { yearly_fee, payment_structureid, academic_startmonth } = req.body;
    if (req.token && mongoose.Types.ObjectId.isValid(req.token.adminId)) {
        let primary1 = mongoConnection.useDb(req.token.database);
        let priamry = mongoConnection.useDb(constants.schoolsuperadmin);
        let adminData = await primary1.model(constants.Model.admin, adminsModel).findById(req.token.adminId);
        if (adminData && adminData != null && adminData.status === true) {
            let havepermission = await config.getsuperadminPermission(req, adminData.roleid, 'fees', 'insertupdate');
            if (havepermission) {
                if (yearly_fee && !(isNaN(yearly_fee)) && yearly_fee > 0) {
                    if (payment_structureid && payment_structureid != '' && payment_structureid != null && payment_structureid != undefined && mongoose.Types.ObjectId.isValid(payment_structureid)) {
                        if (academic_startmonth && !(isNaN(academic_startmonth))) {
                            academic_startmonth -= 1;
                            let feestypedata = await priamry.model(constants.supermodel.feestype, feetypesModel).findById(payment_structureid).lean();
                            if (feestypedata && feestypedata != null) {
                                let installmentfees = Math.round(yearly_fee / feestypedata.noofinstallment);
                                let finalarray = [];
                                if (feestypedata && feestypedata.name && feestypedata.name === 'Monthly') {
                                    let currentyear = new Date().getFullYear();
                                    let startTimestamp = new Date(currentyear, academic_startmonth, 1, 0, 0, 0, 0).getTime();
                                    let endTimestamp = new Date(currentyear + 1, academic_startmonth, 0, 23, 59, 59, 999).getTime();
                                    let dates = await timecalculationhelper.getMonthlyRanges(startTimestamp, endTimestamp);
                                    async.forEachSeries(dates, (date, nextdate) => {
                                        let obj = {
                                            feedate: date.endDate,
                                            feedatetimestamp: date.endTimestamp,
                                            status: 'due',
                                            totalfees: installmentfees,
                                            duefees: installmentfees,
                                            paidfees: 0
                                        };
                                        finalarray.push(obj);
                                        nextdate();
                                    }, () => {
                                        return responseManager.onSuccess('Fees Details...', finalarray, res);
                                    });
                                } else if (feestypedata && feestypedata.name && feestypedata.name === 'Quarterly') {

                                    let currentyear = new Date().getFullYear();
                                    let startTimestamp = new Date(currentyear, academic_startmonth, 1, 0, 0, 0, 0).getTime();
                                    let endTimestamp = new Date(currentyear + 1, academic_startmonth, 0, 23, 59, 59, 999).getTime();
                                    let dates = await timecalculationhelper.generateDatewith3monthdifference(startTimestamp, endTimestamp);
                                    async.forEachSeries(dates, (date, nextdate) => {
                                        let obj = {
                                            feedate: date.endDate,
                                            feedatetimestamp: date.endTimestamp,
                                            status: 'due',
                                            totalfees: installmentfees,
                                            duefees: installmentfees,
                                            paidfees: 0
                                        };
                                        finalarray.push(obj);
                                        nextdate();
                                    }, () => {
                                        return responseManager.onSuccess('Fees Details...', finalarray, res);
                                    });
                                } else if (feestypedata && feestypedata.name && feestypedata.name === 'Semi Annually') {
                                    let currentyear = new Date().getFullYear();
                                    let startTimestamp = new Date(currentyear, academic_startmonth, 1, 0, 0, 0, 0).getTime();
                                    let endTimestamp = new Date(currentyear + 1, academic_startmonth, 0, 23, 59, 59, 999).getTime();
                                    let dates = await timecalculationhelper.generateDatewith6monthdifference(startTimestamp, endTimestamp);
                                    async.forEachSeries(dates, (date, nextdate) => {
                                        let obj = {
                                            feedate: date.endDate,
                                            feedatetimestamp: date.endTimestamp,
                                            status: 'due',
                                            totalfees: installmentfees,
                                            duefees: installmentfees,
                                            paidfees: 0
                                        };
                                        finalarray.push(obj);
                                        nextdate();
                                    }, () => {
                                        return responseManager.onSuccess('Fees Details...', finalarray, res);
                                    });
                                } else if (feestypedata && feestypedata.name && feestypedata.name === 'Annually') {
                                    let currentyear = new Date().getFullYear();
                                    let startTimestamp = new Date(currentyear, academic_startmonth, 1, 0, 0, 0, 0).getTime();
                                    let endTimestamp = new Date(currentyear, (academic_startmonth + 1), 0, 23, 59, 59, 999).getTime();
                                    let obj = {
                                        feedate: new Date(endTimestamp),
                                        feedatetimestamp: endTimestamp,
                                        status: 'due',
                                        totalfee: installmentfees,
                                        duefee: installmentfees,
                                        paidfee: 0,
                                        recipeno: "",
                                        transactionid: ""
                                    };
                                    finalarray.push(obj);
                                    return responseManager.onSuccess('Fee dates details...', finalarray, res);
                                }
                            } else {
                                return responseManager.onBadRequest({ message: 'Payment Structureid...' }, res);
                            }
                        } else {
                            return responseManager.onBadRequest({ message: 'academicstartmonth is invalid' }, res);
                        }
                    } else {
                        return responseManager.onBadRequest({ message: 'Payment_structureId is invalid...' }, res);
                    }

                } else {
                    return responseManager.onBadRequest({ message: "Yearly_fees Is Invalid..." }, res)
                }
            } else {
                return responseManager.accessdenied(res);
            }
        } else {
            return responseManager.onBadRequest({ message: "status" }, res);
        }
    } else {
        return responseManager.onBadRequest({ message: "token" }, res)
    }


};