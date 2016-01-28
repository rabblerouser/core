'use strict';
var winston = require('winston'),
    moment = require('moment');

const winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({
        timestamp: () => {
            return `[${moment().format()}]`;
        },
        formatter: (options) => {
            return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
    })]
});

var logMemberSignUpEvent = (member) => {
    winstonLogger.info('[member-sign-up-event]', { member: member });
};

var logNewInvoiceEvent = (invoice) => {
    winstonLogger.info('[new-invoice-event]', { invoice: invoice });
};

var logUpdateInvoiceEvent = (invoiceId, invoice) => {
    winstonLogger.info('[update-invoice-event]', { id: invoiceId, invoice: invoice });
};

var logCreateEmptyInvoiceEvent = (memberEmail, reference) => {
    winstonLogger.info('[create-emtpy-invoice-event]', { memberEmail: memberEmail, reference: reference });
};

var logNewChargeEvent = (stripeToken) => {
    winstonLogger.info('[new-charge-event]', { stripeToken: stripeToken });
};

var logNewFailedCharge = (stripeToken, error) => {
    winstonLogger.info('[new-charge-event-failed]', { stripeToken: stripeToken, error: error});
};

var logError = (error) => {
    winstonLogger.error({ error: error });
};


let logVerificationEmailSent = function(email) {
    winstonLogger.info('[verification-email-sent]', { email: email });
}

var logNewPaypalUpdate = (invoiceId, paypalId) => {
    winstonLogger.info('[new-paypal-update]', { invoiceId: invoiceId, paypalId: paypalId});
};

var logNewFailedPaypalUpdate = (invoiceId, paypalId) => {
    winstonLogger.info('[paypal-update-failed]', { invoiceId: invoiceId, paypalId: paypalId});
};

var paypalPaymentStatusWasNotCompleted = (invoiceId, txnId, paymentStatus) => {
    winstonLogger.info('[paypal-status-not-completed]', { invoiceId: invoiceId, txnId: txnId, paymentStatus: paymentStatus});
};

var paypalVerifyFailed = (error) => {
    winstonLogger.info('[paypal-verify-failed]', { error: error });
};

module.exports = {
    logMemberSignUpEvent: logMemberSignUpEvent,
    logNewInvoiceEvent: logNewInvoiceEvent,
    logUpdateInvoiceEvent: logUpdateInvoiceEvent,
    logNewChargeEvent: logNewChargeEvent,
    logNewFailedCharge: logNewFailedCharge,
    logCreateEmptyInvoiceEvent: logCreateEmptyInvoiceEvent,
    logError: logError,
    logVerificationEmailSent: logVerificationEmailSent,
    logNewPaypalUpdate: logNewPaypalUpdate,
    logNewFailedPaypalUpdate: logNewFailedPaypalUpdate,
    paypalPaymentStatusWasNotCompleted: paypalPaymentStatusWasNotCompleted,
    paypalVerifyFailed: paypalVerifyFailed
};
