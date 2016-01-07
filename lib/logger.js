'use strict';
var winston = require('winston');

const winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)()]
});

var logMemberSignUpEvent = (member) => {
    const prefix = '[member-sign-up-event]'
    winstonLogger.info('[member-sign-up-event]', { member: member });
};

module.exports = {
    logMemberSignUpEvent: logMemberSignUpEvent
};
