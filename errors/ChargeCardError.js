'use strict';

function ChargeCardError(message) {
    this.message = message;
    this.name = 'ChargeCardError';
    Error.captureStackTrace(this, ChargeCardError);
}

ChargeCardError.prototype = Object.create(Error.prototype);
ChargeCardError.prototype.constructor = ChargeCardError;

module.exports = ChargeCardError;

