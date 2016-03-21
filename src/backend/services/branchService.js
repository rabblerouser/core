'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
    Branch = models.Branch,
    AdminUser = models.AdminUser;

function handleError(logMessage, userMessage) {
    return function(error) {
        logger.error(logMessage, { error: error.toString() });
        throw new Error(userMessage);
    };
}

let transformAdmin = dbResult => {
    return dbResult.dataValues;
};

let transformBranch = dbResult => {
    if (dbResult.dataValues) {
        return {
            id: dbResult.dataValues.id,
            name: dbResult.dataValues.name,
            notes: dbResult.dataValues.notes,
            contact: dbResult.dataValues.contact
        };
    }
};

let transformGroup = dbResult => {
    return dbResult.dataValues;
};

function transformAdmins(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

function transformBranches(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

function transformGroups(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

let list = () => {
    let query = {
        attributes: [
            'id',
            'name'
        ]
    };

    return Branch.findAll(query)
        .then(transformBranches(transformBranch))
        .catch(handleError('[branches-list-error]', 'An error has occurred while fetching branches'));
};

let admins = (id) => {

    let query = {
        attributes: [
            'id',
            'name',
            'email',
            'phoneNumber'
        ],
        where: {branchId: id}
    };

    return AdminUser.findAll(query)
        .then(result => {
            if(!result) {
                throw('');
            }
            return result;
        })
        .then(transformAdmins(transformAdmin))
        .catch(handleError('[find-admins-in-branch-by-id-error]', `Error when looking up admins in branch with id: ${id}`));
};

function groupsInBranch(id) {
    return Branch.findById(id)
        .then(result => {
            if(!result) {
                throw('');
            }
            return result.getGroups();
        })
        .then(transformGroups(transformGroup))
        .catch(handleError('[find-groups-in-branch-by-id-error]', `Error when looking up groups in branch with id: ${id}`));
}

function findById(id) {
    if (!id) {
        return Promise.resolve({});
    }

    return Branch.findById(id)
        .then((result) => {
            return result ? transformBranch(result) : {};
        }).catch(handleError('[find-branch-by-id-error]', `Error when looking up branch with id: ${id}`));
}

module.exports = {
    list: list,
    admins: admins,
    findById: findById,
    groupsInBranch: groupsInBranch
};
