'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeHandler = require('../lib/stripeHandler'),
    ChargeCardError = require('../errors/ChargeCardError'),
    moment = require('moment'),
    _ = require('lodash'),
    Invoice = models.Invoice,
    Member = models.Member;

function findInvoice(invoiceId) {
    return Q(Invoice.findOne({where: {id: invoiceId}}))
        .then((result) => {
            if (_.isEmpty(result)) {
                throw new Error(`Invoice not found for Id: ${invoiceId}`);
            }
            return result.dataValues.id;
        });
}

function updateInvoice(updateFields) {
    return function (invoiceId) {
        return Invoice.update(updateFields, {where: {id: invoiceId}});
    };
}

function updateInvoiceReference(membershipType) {
    return function (data) {
        let invoiceId = data.dataValues.id;
        let updateFields = {
            reference: membershipType.substring(0, 3).toUpperCase() + invoiceId
        };

        return findInvoice(invoiceId)
            .then(updateInvoice(updateFields))
            .tap(()=> {
                logger.logUpdateInvoiceEvent(invoiceId, updateFields);
            })
            .then(()=> {
                return {id: invoiceId};
            });
    };
}

let handleError = (error) => {
    logger.logError(error);
    throw new Error('An error has occurred internally.');
};

var createEmptyInvoice = (memberEmail, membershipType) => {
    return Q({
        memberEmail: memberEmail,
        totalAmountInCents: 0,
        paymentDate: moment().format('L'),
        paymentType: '',
        reference: ''
    })
        .then(Invoice.create.bind(Invoice))
        .tap(logger.logCreateEmptyInvoiceEvent)
        .then(updateInvoiceReference(membershipType))
        .catch(handleError);
};

function chargeCard(stripeToken, totalAmount) {
    return stripeHandler.chargeCard(stripeToken, totalAmount)
        .tap(() => {
            logger.logNewChargeEvent(stripeToken);
        })
        .catch((error)=> {
            logger.logNewFailedCharge(stripeToken, error);
            throw new ChargeCardError('Failed to charge card!');
        });
}

function updatePaymentForInvoice(invoice) {
    var updateFields = {
        totalAmountInCents: invoice.totalAmount * 100,
        paymentDate: moment().format('L'),
        paymentType: invoice.paymentType,
        paymentStatus: invoice.paymentStatus || 'Pending'
    };

    if (invoice.paymentType === 'stripe') {
        updateFields.transactionId = invoice.transactionId;
    }

    return findInvoice(invoice.invoiceId)
        .then(updateInvoice(updateFields))
        .tap(()=> {
            logger.logUpdateInvoiceEvent(invoice.invoiceId, updateFields);
        });
}

function updateStripePaymentForInvoice(invoice) {
    return function (charge) {
        invoice.paymentStatus = 'PAID';
        invoice.transactionId = charge.id;
        return updatePaymentForInvoice(invoice);
    };
}

var payForInvoice = (invoice) => {
    if (invoice.paymentType === 'stripe') {
        return chargeCard(invoice.stripeToken, invoice.totalAmount)
            .then(updateStripePaymentForInvoice(invoice));
    } else {
        return updatePaymentForInvoice(invoice);
    }
};

var paypalChargeSuccess = (customInvoiceId, paypalId) => {
    function checkResultOfUpdate(value) {
        if (!value || value[0] !== 1) {
            logger.logNewFailedPaypalUpdate(customInvoiceId, paypalId);
            return Q.reject('Failed to update ' + customInvoiceId + ' in the database');
        }
    }

    function logUpdate() {
        logger.logNewPaypalUpdate(customInvoiceId, paypalId);
    }

    return models.sequelize.transaction(function (t) {
        return Invoice.update({
                transactionId: paypalId,
                'paymentStatus': 'PAID'
            }, {
                where: {id: customInvoiceId}
            }, {transaction: t})
            .tap(logUpdate)
            .then(checkResultOfUpdate);
    }).catch((err) => {
        return Q.reject(err);
    });
};

let transformMemberWithInvoice = invoice => {
    let newInvoiceRoot = invoice.dataValues;
    let newMemberRoot = invoice.dataValues.member.dataValues;
    delete newInvoiceRoot.member;
    return Object.assign({}, newMemberRoot, newInvoiceRoot);
};

function transformMembersWithInvoice(adapter) {
    return function (memberQueryResult) {
        return memberQueryResult.map(adapter);
    };
}

function unconfirmedPaymentList() {
    function handleError(message) {
        return function (error) {
            logger.logError(error, message);
            return models.Sequelize.Promise.reject(message);
        };
    }

    let query = {
        include: [{
            model: Member,
            as: 'member',
            attributes: [
                'firstName',
                'lastName'
            ]
        }],
        attributes: ['reference', 'paymentType', 'totalAmountInCents', 'paymentStatus'],
        where: {
            paymentStatus: 'Pending',
            paymentType: ['cheque', 'deposit']
        }
    };

    return Invoice.findAll(query)
        .then(transformMembersWithInvoice(transformMemberWithInvoice))
        .catch(handleError('An error has occurred while fetching unconfirmed members'));
}

function acceptPayment(reference) {

    function checkResultOfUpdate(value) {
        if (!value || value[0] !== 1) {
            logger.logError('[failed-to-accept-invoice]', '');
            return Q.reject('Failed to accept ' + reference + ' in the database');
        }
    }

    function logUpdate() {
        logger.logInfoEvent('[updating-invoice-status]', 'Updating invoice with reference: ' + reference);
    }

    return models.sequelize.transaction(function (t) {
        return Invoice.update({
                'paymentStatus': 'PAID'
            }, {
                where: {reference: reference}
            }, {transaction: t})
            .tap(logUpdate)
            .then(checkResultOfUpdate);
    }).catch((err) => {
        return Q.reject(err);
    });
}

module.exports = {
    payForInvoice: payForInvoice,
    createEmptyInvoice: createEmptyInvoice,
    paypalChargeSuccess: paypalChargeSuccess,
    unconfirmedPaymentList: unconfirmedPaymentList,
    acceptPayment: acceptPayment
};
