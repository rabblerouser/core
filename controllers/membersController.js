'use strict';

var memberService = require('../services/memberService');
var invoiceService = require('../services/invoiceService');
var memberValidator = require('../lib/memberValidator');

function isPostalAddressEmpty(postalAddress){
  return  postalAddress.address === '' &&
          postalAddress.suburb === '' &&
          postalAddress.postcode === '';
}

function residentialAddress(req) {
    return {
      address: req.body.residentialAddress.address,
      suburb: req.body.residentialAddress.suburb,
      postcode: req.body.residentialAddress.postcode,
      state: req.body.residentialAddress.state,
      country: req.body.residentialAddress.country
    };
}

function postalAddress(req) {
  if (isPostalAddressEmpty(req)) {
    return residentialAddress(req);
  }

  return {
    address: req.body.postalAddress.address,
    suburb: req.body.postalAddress.suburb,
    postcode: req.body.postalAddress.postcode,
    state: req.body.postalAddress.state,
    country: req.body.postalAddress.country
  };
}

function setupNewMember(req) {
  return {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      gender: req.body.gender,
      primaryPhoneNumber: req.body.primaryPhoneNumber,
      secondaryPhoneNumber: req.body.secondaryPhoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      residentialAddress: residentialAddress(req),
      postalAddress: postalAddress(req),
      membershipType: req.body.membershipType
  };
}

function invoiceReference(member) {
  return member.membershipType.substring(0,3).toUpperCase() + member.id;
}

var newMemberHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    let newMember = setupNewMember(req);

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    var returnValues = {};

    return memberService.createMember(newMember)
        .then((createdMember)=> {
            returnValues.newMember = createdMember;
            return invoiceService.createEmptyInvoice(newMember.email, invoiceReference(createdMember));
        })
        .then((createdInvoice)=> {
            returnValues.invoiceId = createdInvoice.dataValues.id;
            res.status(200).json(returnValues);
        })
        .catch(dbError);
};

module.exports = {
    newMemberHandler: newMemberHandler
};
