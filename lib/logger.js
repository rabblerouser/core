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


var logError = (error, message) => {
    winstonLogger.error(message || '', { error: error });
};

function logInfoEvent(eventId, eventData) {
  winstonLogger.info(eventId || 'unnamed-event', eventData || {});
}

var logMemberSignUpEvent = (member) => {
  logInfoEvent('[member-sign-up-event]', { member: member });
};

var logNewInvoiceEvent = (invoice) => {
  logInfoEvent('[new-invoice-event]', { invoice: invoice });
};

var logUpdateInvoiceEvent = (invoiceId, updatedFields) => {
  logInfoEvent('[update-invoice-event]', {invoiceId: invoiceId, updatedFields: updatedFields });
};

var logCreateEmptyInvoiceEvent = (invoice) => {
  logInfoEvent('[create-emtpy-invoice-event]', { invoice: invoice.dataValues});
};

var logNewChargeEvent = (stripeToken) => {
  logInfoEvent('[new-charge-event]', { stripeToken: stripeToken });
};

var logNewFailedCharge = (stripeToken, error) => {
  logInfoEvent('[new-charge-event-failed]', { stripeToken: stripeToken, error: error});
};

let logVerificationEmailSent = function(email) {
  logInfoEvent('[verification-email-sent]', { email: email });
};

var logNewPaypalUpdate = (invoiceId, paypalId) => {
  logInfoEvent('[new-paypal-update]', { invoiceId: invoiceId, paypalId: paypalId});
};

var logNewFailedPaypalUpdate = (invoiceId, paypalId) => {
  logInfoEvent('[paypal-update-failed]', { invoiceId: invoiceId, paypalId: paypalId});
};

var invalidPaypalIpnRequest = (invoiceId, txnId, paymentStatus, receiverEmail) => {
  logInfoEvent('[paypal-invalid-ipn-request]', { invoiceId: invoiceId, txnId: txnId, paymentStatus: paymentStatus, receiverEmail: receiverEmail});
};

var paypalVerifyFailed = (error) => {
  logInfoEvent('[paypal-verify-failed]', { error: error });
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
    invalidPaypalIpnRequest: invalidPaypalIpnRequest,
    paypalVerifyFailed: paypalVerifyFailed,
    logInfoEvent: logInfoEvent
};
