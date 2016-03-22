'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    Branch = models.Branch,
    uuid = require('node-uuid');

function createHash() {
  return uuid.v4();
}

function handleError(logMessage, userMessage) {
    return function(error) {
        logger.error(logMessage, { error: error.toString() });
        throw new Error(userMessage);
    };
}

function handleError(logMessage, userMessage) {
    return function(error) {
        logger.error(logMessage, { error: error.toString() });
        throw new Error(userMessage);
    };
}

function logEvent(saveResult) {
    logger.info('[admin-user-sign-up-event]', saveResult.dataValues);
}

function save(branch) {
  return Branch.create.bind(Branch)(branch);
}

let setupNewBranch = (newBranch) => {
    return Object.assign({}, newBranch, {id: createHash()});
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

let create = (newBranch) => {
    return Q.all(setupNewBranch(newBranch))
          .then(save)
          .tap(logEvent)
          .then(transformBranch)
          .catch(handleError('Create branch failed'));
};


let update = (newValues) => {
    return Branch.findOne({where: {id: newValues.id}})
    .then( branch => {
        return branch.update(newValues);
    })
    .tap(() => logger.info('[update-branch]', `branch with id ${newValues.id} updated`))
    .then(transformBranch)
    .catch(handleError(`Error when editing branch with id ${newValues.id}`));
};

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
    create: create,
    update: update,
    findById: findById,
    groupsInBranch: groupsInBranch
};
