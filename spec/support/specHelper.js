'use strict';

var models = require("../../models"),
    Address = models.Address,
    Member = models.Member;

beforeEach((done) => {
    Address.truncate({cascade: true}).then(() => {
        Member.truncate({cascade: true}).nodeify(done);
    });
});
