'use strict';
var winston = require('winston');

const winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)()]
});

var logMemberSignUpEvent = (member) => {
    winstonLogger.info('[member-sign-up-event]', { member: member });
};

var logNewInvoiceEvent = (invoice) => {
    winstonLogger.info('[new-invoice-event]', { invoice: invoice });
};

module.exports = {
    logMemberSignUpEvent: logMemberSignUpEvent,
    logNewInvoiceEvent: logNewInvoiceEvent
};
