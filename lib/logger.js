'use strict';
var winston = require('winston');

const winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)()]
});

var info = (message) => {
    winstonLogger.info(message);
};

module.exports = {
    info: info
};
