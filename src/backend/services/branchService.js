'use strict';

const models = require('../models'),
    temporaryLogger = require('../lib/logger').temporarySolution,
    Address = models.Address,
    Branch = models.Branch;

function handleError(message) {
    return function(error) {
        temporaryLogger.error(message, { error: error.toString() });
        return models.Sequelize.Promise.reject(message);
    };
}

let transformBranch = dbResult => {
    let branch = dbResult.dataValues;
    let residentialAddressFromDb = dbResult.dataValues.residentialAddress;
    let postalAddressFromDb = dbResult.dataValues.postalAddressFromDb;

    let residentialAddress = residentialAddressFromDb ? residentialAddressFromDb.dataValues : null;
    let postalAddress = postalAddressFromDb ? postalAddressFromDb.dataValues : null;

    return Object.assign({}, branch, { residentialAddress: residentialAddress, postalAddress: postalAddress });
};

function transformBranchs(adapter) {
    return function (branchQueryResult) {
        return branchQueryResult.map(adapter);
    };
}

let list = () => {
    let query = {
        include: [{
            model: Address,
            as: 'residentialAddress',
            attributes: ['postcode', 'state', 'country']
        }],
        attributes: [
            'id',
            'firstName',
            'lastName',
            'branchshipType',
            'verified'
        ]
    };

    return Branch.findAll(query)
        .then(transformBranchs(transformBranch))
        .catch(handleError('An error has occurred while fetching branches'));
};

module.exports = {
    list: list
};
