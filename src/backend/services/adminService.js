'use strict';
const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    moment = require('moment'),
    AdminUser = models.AdminUser,
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

function logEvent(saveResult) {
    logger.info('[admin-user-sign-up-event]', saveResult.dataValues);
}

let transformAdmin = dbResult => {
    return {
        id: dbResult.dataValues.id,
        name: dbResult.dataValues.name,
        phoneNumber: dbResult.dataValues.phoneNumber,
        email: dbResult.dataValues.email
    };
};

function transformAdmins(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

function save(adminUser) {
  return AdminUser.create.bind(AdminUser)(adminUser);
}

let setupNewAdmin = (newAdmin) => {
    return Object.assign({}, newAdmin, {id: createHash(), memberSince: moment()});
};


let create = (newAdmin) => {
    return Q.all(setupNewAdmin(newAdmin))
          .then(save)
          .tap(logEvent)
          .then(transformAdmin)
          .catch(handleError('[create-admin-failed]', 'Create admin user failed'));
};

let deleteAdmin = (id) => {
    return AdminUser.destroy({where: {id: id}})
    .then((result) => {
        if(!result) {
            throw new Error('No records were deleted');
        }

        logger.info('[delete-admin]', `admin with id ${id} deleted`);
    })
    .catch(handleError('[delete-admin-failed]', `An error has occurred while deleting the admin with id: ${id}`));
};

let updateAdmin = (newValues) => {

    return AdminUser.findOne({where: {id: newValues.id}})
    .then( admin => {
        return admin.update(newValues);
    })
    .tap(() => logger.info('[update-admin]', `admin with id ${newValues.id} updated`))
    .then(transformAdmin)
    .catch(handleError('[update-admin-failed]', `Error when editing admin with id ${newValues.id}`));

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

module.exports = {
    admins: admins,
    updateAdmin: updateAdmin,
    create: create,
    delete: deleteAdmin
};
