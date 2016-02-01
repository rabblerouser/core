'use strict';

const sinon = require("sinon");
const Q = require("q");
require("jasmine-sinon");

var logger = require('../../lib/logger');
var ChargeCardError = require('../../errors/ChargeCardError');

var models = require("../../models"),
    Address = models.Address,
    Member = models.Member,
    Invoice = models.Invoice,
    AdminUser = models.AdminUser;


beforeEach((done) => {
    Invoice.truncate({cascade: true}).then(() => {
        return Address.truncate({cascade: true});
    }).then(() => {
        return Member.truncate({cascade: true});
    }).then(() => {
        return AdminUser.truncate();
    }).nodeify(done);
});

module.exports = {
    sinon: sinon,
    models: models,
    Q: Q,
    logger: logger,
    ChargeCardError: ChargeCardError
};
