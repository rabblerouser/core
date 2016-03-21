'use strict';

const models = require('../models'),
    logger = require('../lib/logger'),
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

function transformAdmins(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

let updateAdmin = (newValues) => {

    return AdminUser.findOne({where: {id: newValues.id}})
    .then( admin => {
        return admin.update(newValues);
    })
    .tap(() => logger.info('[update-admin]', `admin with id ${newValues.id} updated`))
    .then(transformAdmin)
    .catch(handleError(`Error when editing admin with id ${newValues.id}`));

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
    updateAdmin: updateAdmin
};
