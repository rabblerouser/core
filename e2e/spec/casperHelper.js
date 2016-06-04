const casper = window.casper;

function polyfillFunctionBind() {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      const aArgs = Array.prototype.slice.call(arguments, 1);
      const fToBind = this;
      const FNOP = function() {};
      const fBound = function() {
        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      if (this.prototype) {
        // native functions don't have a prototype
        FNOP.prototype = this.prototype;
      }
      fBound.prototype = new FNOP();

      return fBound;
    };
  }
}

function polyfillObjectAssign() {
  if (typeof Object.assign != 'function') {
    Object.assign = function () {
    // 'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const output = Object(target);
      for (let index = 1; index < arguments.length; index++) {
        const source = arguments[index];
        if (source !== undefined && source !== null) {
          for (let nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }
}

function polyfillArrayFind() {
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {       /* eslint no-extend-native: "off"*/

      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      const list = Object(this);
      const length = list.length >>> 0;
      const thisArg = arguments[1];       /* eslint prefer-rest-params: "off"*/
      let value;

      for (let i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }
}
casper.on('remote.message', function handleRemoteMessage(message) {
  this.echo(`Message: ${JSON.stringify(message)}`);
});

casper.on('page.error', function handlePageError(message, trace) {
  this.echo(`Page error: ${JSON.stringify(message)}`);
  this.echo(JSON.stringify(trace));
});

casper.options.onWaitTimeout = function handleTimeout() {
  this.capture(`screenshots/timeout-${Date.now()}.png`);
  this.test.fail('timed out wating (screenshot taken)');
};

casper.on('page.initialized', function polyFill() {
  this.evaluate(polyfillObjectAssign);
  this.evaluate(polyfillFunctionBind);
  this.evaluate(polyfillArrayFind);
});
