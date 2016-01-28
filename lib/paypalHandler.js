'use strict';

let invoiceService = require('../services/invoiceService');
var paypalIpn = require('paypal-ipn'),
    logger = require('./logger');

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
    handleIpn: handleIpn
};
