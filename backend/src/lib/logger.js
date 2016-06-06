'use strict';

const winston = require('winston');
const moment = require('moment');

const winstonLogger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({
    timestamp: () => `[${moment().toISOString()}]`,
    /* Just trying to make this readable, because I don't really understand it. */
    /* eslint-disable prefer-template */
    formatter: options =>
      `${options.timestamp()} ` +
      `${options.level.toUpperCase()} ` +
      (undefined !== options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''),
    /* eslint-enable prefer-template */
  })],
});

module.exports = winstonLogger;
