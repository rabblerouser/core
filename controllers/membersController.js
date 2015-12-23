'use strict';

var models = require("../models"),
    Member = models.Member,
    Address = models.Address;


var newMemberHandler = (req, res, next) => {
    let dbError = (error) => {
        res.status(500).json({error: error});
        next();
    };

    let newAddress = {
        address: req.body.residentialAddress.address,
        suburb: req.body.residentialAddress.suburb,
        postcode: req.body.residentialAddress.postcode,
        state: req.body.residentialAddress.state,
        country: req.body.residentialAddress.country
    };

    Address.findOrCreate({where: newAddress, defaults: newAddress}).then((addresses) => {
        let newMember = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth,
            residentialAddress: addresses[0].dataValues.id,
            postalAddress: addresses[0].dataValues.id
        };
        Member.create(newMember).then(() => {
            res.status(200).json(null);
            next();
        }).catch(dbError);
    }).catch(dbError);
};


module.exports = {
    newMemberHandler: newMemberHandler
};
