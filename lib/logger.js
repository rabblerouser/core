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

var logNewChargeEvent = (stripeToken) => {
    winstonLogger.info('[new-charge-event]', { stripeToken: stripeToken });
};

var logNewFailedCharge = (stripeToken, error) => {
    winstonLogger.info('[new-charge-event-failed]', { stripeToken: stripeToken, error: error});
};

module.exports = {
    logMemberSignUpEvent: logMemberSignUpEvent,
    logNewInvoiceEvent: logNewInvoiceEvent,
    logNewChargeEvent: logNewChargeEvent,
    logNewFailedCharge: logNewFailedCharge
};
