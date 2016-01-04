'use strict';

const sinon = require("sinon");
const Q = require("q");
require("jasmine-sinon");

var models = require("../../models"),
    Address = models.Address,
    Member = models.Member;

beforeEach((done) => {
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
    Q: Q
};
