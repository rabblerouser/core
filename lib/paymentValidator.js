'use strict';
const validator = require('validator');
const _ = require('lodash');

var isValidAmount = (totalAmount) => {
    return !isEmpty(totalAmount) && !isNaN(totalAmount) && totalAmount >= 1;
};

var isValidPaymentType = (paymentType) => {
    return !isEmpty(paymentType);
};

var isValidId = (id) => {
    return !isEmpty(id) && !isNaN(id);
};

var isEmpty = (data) => {
    if (!data)
        return true;

    return _.isEmpty(data.toString());
};


var isZero = (number) => {
    return number === 0;
};

const noContributeChecks =
{
    totalAmount: isZero,
    paymentType: isValidPaymentType,
    invoiceId: isValidId
};

var isValidNoContribute = (payment) => {
    return _.reduce(noContributeChecks, function(errors, checkFn, paymentFieldKey) {
        if (!payment || !checkFn(payment[paymentFieldKey])){
            errors.push(paymentFieldKey);
        }
        return errors;
    }, []);
};

const paymentFieldsChecks =
{
    totalAmount: isValidAmount,
    paymentType: isValidPaymentType,
    invoiceId: isValidId
};

var isValid = (payment) => {
    return _.reduce(paymentFieldsChecks, function(errors, checkFn, paymentFieldKey) {
        if (!payment || !checkFn(payment[paymentFieldKey])){
            errors.push(paymentFieldKey);
        }
        return errors;
    }, []);
};

module.exports = {
    isValidAmount: isValidAmount,
    isValidPaymentType: isValidPaymentType,
    isValidId: isValidId,
    isValid: isValid,
    isValidNoContribute: isValidNoContribute
};
