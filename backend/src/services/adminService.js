'use strict';

const Q = require('q');
const AdminUser = require('../models').AdminUser;
const logger = require('../lib/logger');
const adminType = require('../security/adminType');
const uuid = require('node-uuid');

function createHash() {
  return uuid.v4();
}

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
}

function logEvent(saveResult) {
  logger.info('[admin-user-sign-up-event]', saveResult.dataValues);
}

const transformAdmin = dbResult => ({
  id: dbResult.dataValues.id,
  name: dbResult.dataValues.name,
  phoneNumber: dbResult.dataValues.phoneNumber,
  email: dbResult.dataValues.email,
});

function transformAdmins(adapter) {
  return dbResult => dbResult.map(adapter);
}

function save(adminUser) {
  return AdminUser.create.bind(AdminUser)(adminUser);
}

const setupNewAdmin = newAdmin =>
  Object.assign({}, newAdmin, { id: createHash() });


const create = newAdmin =>
  Q
    .all(setupNewAdmin(newAdmin))
    .then(save)
    .tap(logEvent)
    .then(transformAdmin)
    .catch(handleError('[create-admin-failed]', 'Create admin user failed'));

const deleteAdmin = id =>
  AdminUser
    .destroy({ where: { id } })
    .then(result => {
      if (!result) {
        throw new Error('No records were deleted');
      }

      logger.info('[delete-admin]', `admin with id ${id} deleted`);
    })
    .catch(handleError('[delete-admin-failed]', `An error has occurred while deleting the admin with id: ${id}`));

const updateAdmin = newValues =>
  AdminUser
    .findOne({ where: { id: newValues.id } })
    .then(admin => admin.update(newValues))
    .tap(() => logger.info('[update-admin]', `admin with id ${newValues.id} updated`))
    .then(transformAdmin)
    .catch(handleError('[update-admin-failed]', `Error when editing admin with id ${newValues.id}`));

const superAdmins = () => {
  const query = {
    attributes: [
      'id',
      'name',
      'email',
      'phoneNumber',
    ],
    where: {
      type: adminType.super,
    },
  };

  return AdminUser.findAll(query)
    .then(result => {
      if (!result) {
        throw new Error();
      }
      return result;
    })
    .then(transformAdmins(transformAdmin))
    .catch(handleError('[find-super-admins]', 'Error when looking up super admins'));
};

const admins = id => {
  const query = {
    attributes: [
      'id',
      'name',
      'email',
      'phoneNumber',
    ],
    where: { branchId: id },
  };

  return AdminUser.findAll(query)
    .then(result => {
      if (!result) {
        throw new Error();
      }
      return result;
    })
    .then(transformAdmins(transformAdmin))
    .catch(handleError('[find-admins-in-branch-by-id-error]', `Error when looking up admins in branch with id: ${id}`));
};

module.exports = {
  admins,
  updateAdmin,
  create,
  delete: deleteAdmin,
  superAdmins,
};
