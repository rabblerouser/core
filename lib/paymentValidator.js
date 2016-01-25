'use strict';
const validator = require('validator');
const _ = require('lodash');

var isValidAmount = (totalAmount) => {
    return totalAmount !== '' && !isNaN(totalAmount) && totalAmount >= 1;
};

var isValidPaymentType = (paymentType) => {
    return !_.isEmpty(paymentType);
};

var isValidEmail = (email) => {
    return validator.isEmail(email);
};

var isValidId = (id) => {
  return !_.isEmpty(id) && !isNaN(id);
};

var isValidUUID = (uuid) => {
  return !_.isEmpty(uuid);
}

var isValidMembershipType = (membershipType) => {
  return !_.isEmpty(membershipType);
}

const paymentFieldsChecks =
{
    memberEmail: isValidEmail,
    totalAmount: isValidAmount,
    paymentType: isValidPaymentType
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
