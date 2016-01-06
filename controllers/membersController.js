'use strict';

var memberService = require("../services/memberService");
var memberValidator = require("../lib/memberValidator");

var newMemberHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({error: error});
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
        gender: req.body.gender,
        primaryPhoneNumber: req.body.primaryPhoneNumber,
        secondaryPhoneNumber: req.body.secondaryPhoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        residentialAddress: residentialAddress,
        postalAddress: postalAddress
    };

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        res.status(400).json({error: validationErrors});
    }

    return memberService.createMember(newMember)
        .then(() => {
            res.status(200).render('members/success', {email: req.body.email});
        })
        .catch(dbError);
};

module.exports = {
    newMemberHandler: newMemberHandler
};
