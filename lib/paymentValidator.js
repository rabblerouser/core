'use strict';
const validator = require('validator');
const _ = require('lodash');

var isValidAmount = (totalAmount) => {
    return !isEmpty(totalAmount) && !isNaN(totalAmount) && totalAmount >= 1;
};

var isValidPaymentType = (paymentType) => {
    return !isEmpty(paymentType);
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidId = (id) => {
  return !isEmpty(id) && !isNaN(id);
};

var isEmpty = (data) => {
    if (!data)
        return true;

    return _.isEmpty(data.toString());
}

var isValidUUID = (uuid) => {
  return !isEmpty(uuid);
}

var isValidMembershipType = (membershipType) => {
  return !isEmpty(membershipType);
}

const paymentFieldsChecks =
{
    memberEmail: isValidEmail,
    totalAmount: isValidAmount,
    paymentType: isValidPaymentType,
    uuid: isValidUUID,
    invoiceId: isValidId,
    membershipType: isValidMembershipType
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
    isValidEmail: isValidEmail,
    isValidId: isValidId,
    isValidUUID: isValidUUID,
    isValidMembershipType: isValidMembershipType,
    isValid: isValid
};
