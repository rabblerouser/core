const winston = require('winston');

module.exports = new winston.Logger({
  level: process.env.NODE_ENV === 'test' ? -1 : 'info',
  transports: [new winston.transports.Console({
    timestamp: () => new Date().toISOString(),
    formatter: ({ timestamp, level, message }) => `[${timestamp()}] ${level} ${message}`,
  })],
});
