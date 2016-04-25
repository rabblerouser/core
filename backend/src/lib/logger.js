'use strict';
var winston = require('winston'),
    moment = require('moment');

const winstonLogger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({
        timestamp: () => {
            return `[${moment().toISOString()}]`;
        },
        formatter: (options) => {
            return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
    })]
});

module.exports = winstonLogger;
