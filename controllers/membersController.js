'use strict';

const moment = require("moment");

var models = require("../models"),
    Member = models.Member,
    Address = models.Address;


var newMemberHandler = (req, res, next) => {
    let newMember = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: Date.parse(req.body.dateOfBirth)
    };

    Member.create(newMember);
    next();
};

module.exports = {
    newMemberHandler: newMemberHandler
};
