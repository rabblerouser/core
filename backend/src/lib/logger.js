'use strict';

const winston = require('winston');
const moment = require('moment');

const formatter = options => {
  const timestamp = options.timestamp();
  const level = options.level.toUpperCase();
  const message = options.message || '';
  const metaPresent = options.meta && Object.keys(options.meta).length;
  const meta = metaPresent ? `\n\t${JSON.stringify(options.meta)}` : '';
  return `${timestamp} ${level} ${message} ${meta}`;
};

const transport = new (winston.transports.Console)({
  level: process.env.NODE_ENV === 'test' ? -1 : 'debug',
  timestamp: () => `[${moment().toISOString()}]`,
  formatter,
});
const winstonLogger = new (winston.Logger)({
  transports: [transport],
});

module.exports = winstonLogger;
