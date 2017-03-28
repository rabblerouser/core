'use strict';

const AdminUser = require('../models').AdminUser;
const logger = require('../lib/logger');
const adminType = require('../security/adminType');

function handleError(logMessage, userMessage) {
  return error => {
    logger.error(logMessage, { error: error.toString() });
    throw new Error(userMessage);
  };
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
  superAdmins,
};
