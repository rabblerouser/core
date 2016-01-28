'use strict';

let invoiceService = require('../services/invoiceService');
var paypalIpn = require('paypal-ipn'),
    logger = require('./logger');

var env = process.env.NODE_ENV || 'development';

var config = null;
try {
    var configFile = require(__dirname + '/../config/paypal-config.json');
    config = configFile[env];
} catch (e) {
    console.log("Could not find paypal config file");
}

var getServerUrl = () => {
    if(config) {
        return config.paypal_server_url;
    }

    return undefined;
};

var getReturnUrl = () => {
    if(config) {
        return config.paypal_return_url;
    }

    return undefined;
};

var handleIpn = (req, res) => {
    paypalIpn.verify(req.body, {'allow_sandbox': true}, function callback(err, mes) {
      if (err) {
          logger.paypalVerifyFailed(err);
          res.sendStatus(400);
      } else {
          if (req.body.payment_status === 'Completed') {
              invoiceService.paypalChargeSuccess(req.body.custom, req.body.txn_id)
              .then( () => {
                  res.sendStatus(200);
              }).catch( () => {
                  res.sendStatus(400);
              });
          } else {
              logger.paypalPaymentStatusWasNotCompleted(req.body.custom, req.body.txn_id, req.body.payment_status);
              res.sendStatus(400);
          }
      }
    });
};

module.exports = {
    handleIpn: handleIpn,
    getServerUrl: getServerUrl,
    getReturnUrl: getReturnUrl
};
