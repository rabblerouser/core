'use strict';

var models = require("../models"),
    Member = models.Member,
    Address = models.Address,
    memberService = require("../services/memberService");


var newMemberHandler = (req, res, next) => {
    let dbError = (error) => {
        res.status(500).json({error: error});
        next();
    };

    let residentialAddress = {
        address: req.body.residentialAddress.address,
        suburb: req.body.residentialAddress.suburb,
        postcode: req.body.residentialAddress.postcode,
        state: req.body.residentialAddress.state,
        country: req.body.residentialAddress.country
    };

    let postalAddress = {
        address: req.body.postalAddress.address,
        suburb: req.body.postalAddress.suburb,
        postcode: req.body.postalAddress.postcode,
        state: req.body.postalAddress.state,
        country: req.body.postalAddress.country
    };

    let newMember = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        residentialAddress: residentialAddress,
        postalAddress: postalAddress
    };

    memberService.createMember(newMember)
        .then(() => {
            res.status(200).json(null);
            next();
        })
        .catch(dbError);
};

module.exports = {
    newMemberHandler: newMemberHandler
};
