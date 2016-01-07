'use strict';

const sinon = require("sinon");
const Q = require("q");
require("jasmine-sinon");

var logger = require('../../lib/logger');

var models = require("../../models"),
    Address = models.Address,
    Member = models.Member,
    Invoice = models.Invoice;

beforeEach((done) => {
    Invoice.truncate({cascade: true});
    Address.truncate({cascade: true}).then(() => {
        Member.truncate({cascade: true}).nodeify(done);
    });
});

global.finishSupertest = (done) => {
    return (err) => {
        if (err) {
            done.fail(err);
        }
        else {
            done();
        }
    };
};

module.exports = {
    sinon: sinon,
    models: models,
    Q: Q,
    logger: logger
};
