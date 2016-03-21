'use strict';

let reporters = require('jasmine-reporters');
const sinon = require('sinon');
const Q = require('q');
require('jasmine-sinon');

var logger = require('../../src/backend/lib/logger');
var ChargeCardError = require('../../src/backend/errors/ChargeCardError');

var models = require('../../src/backend/models'),
    Address = models.Address,
    Member = models.Member,
    Branch = models.Branch,
    AdminUser = models.AdminUser,
    BranchGroup = models.BranchGroup,
    Group = models.Group;

var terminalReporter = new reporters.TerminalReporter({
    verbosity: 1,
    color: true,
    showStack: true
});
jasmine.getEnv().addReporter(terminalReporter);

beforeEach((done) => {
    Address.truncate({cascade: true})
    .then(() => {
        return Member.truncate({cascade: true});
    })
    .then(() => {
        return AdminUser.truncate({cascade: true});
    })
    .then(() => {
        return BranchGroup.truncate({cascade: true});
    })
    .then(() => {
        return Group.truncate({cascade: true});
    })
    .then(() => {
        return Branch.truncate({cascade: true});
    })
    .nodeify(done);
});

module.exports = {
    sinon: sinon,
    models: models,
    Q: Q,
    logger: logger,
    ChargeCardError: ChargeCardError
};
