'use strict';

var models = require("../models"),
    Member = models.Member,
    Address = models.Address;


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

    Address.findOrCreate({where: residentialAddress, defaults: residentialAddress}).then((residentialAddresses) => {
        Address.findOrCreate({where: postalAddress, defaults: postalAddress}).then( (postalAddresses) => {
            let newMember = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                dateOfBirth: req.body.dateOfBirth,
                residentialAddress: residentialAddresses[0].dataValues.id,
                postalAddress: postalAddresses[0].dataValues.id
            };
            Member.create(newMember).then(() => {
                res.status(200).json(null);
                next();
            }).catch(dbError);
        }).catch(dbError);
    }).catch(dbError);
};


module.exports = {
    newMemberHandler: newMemberHandler
};
