'use strict';

const uuid = require('node-uuid');
const hash = require('../security/hash');
const adminService = require('../services/adminService');
const logger = require('../lib/logger');
const validator = require('../lib/inputValidator');
const adminValidator = require('../lib/adminValidator');
const streamClient = require('../streamClient');

const createAdmin = adminType => (req, res) => {
  const branchId = req.params.branchId;
  const admin = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    type: adminType,
    branchId,
  };

  const validationErrors = adminValidator.isValid(admin);
  if (validationErrors.length > 0) {
    logger.info('[create-new-admin-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  admin.password = hash(admin.password || '');
  return streamClient.publish('admin-created', admin)
    .then(() => res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      type: admin.type,
      branchId: admin.branchId,
    }))
    .catch(error => {
      logger.error('Failed creating a new admin user', error);
      return res.sendStatus(500);
    });
};

const updateAdmin = (req, res) => {
  const admin = {
    id: req.params.adminId,
    branchId: req.params.branchId,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  };

  const validationErrors = adminValidator.isValidWithoutPassword(admin);
  if (validationErrors.length > 0) {
    logger.info('[update-user-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }
  if (admin.password) {
    admin.password = hash(admin.password);
  }
  return streamClient.publish('admin-edited', admin)
    .then(() => res.status(200).json({
      id: admin.id,
      branchId: admin.branchId,
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
    }))
    .catch(error => {
      logger.error(`Failed updating the admin user with id:${admin.id}`, error);
      res.sendStatus(500);
    });
};

function deleteBranchAdmin(req, res) {
  const branchId = req.params.branchId;
  const adminId = req.params.adminId;

  if (!(validator.isValidUUID(branchId) && validator.isValidUUID(adminId))) {
    logger.error(`Failed deleting the admin with id:${adminId} and branchId: ${branchId}`);
    return res.sendStatus(400);
  }

  return adminService.delete(adminId)
  .then(() => res.sendStatus(200))
  .catch(error => {
    logger.error(`Failed deleting the admin with id:${adminId} and branchId: ${branchId}}`, error);
    res.sendStatus(500);
  });
}

function getBranchAdmins(req, res) {
  return adminService.admins(req.params.branchId)
  .then(result => res.status(200).json({ admins: result }))
  .catch(error => {
    switch (error) {
      case 'invalid branch id' :
        res.sendStatus(400);
        break;
      default:
        res.sendStatus(500);
        break;
    }
  });
}

function getAllAdmins(req, res) {
  return adminService.superAdmins()
  .then(result => res.status(200).json({ admins: result }))
  .catch(error => {
    logger.error('Error when getting super admins list', error);
    res.sendStatus(500);
  });
}

function deleteSuperAdmin(req, res) {
  const adminId = req.params.adminId;

  if (!validator.isValidUUID(adminId)) {
    logger.error(`Failed deleting the super admin with id:${adminId}`);
    return res.sendStatus(400);
  }

  return adminService.delete(adminId)
  .then(() => res.sendStatus(200))
  .catch(error => {
    logger.error(`Failed deleting the admin with id:${adminId}`, error);
    res.sendStatus(500);
  });
}

module.exports = {
  getBranchAdmins,
  createAdmin,
  updateAdmin,
  deleteBranchAdmin,
  getAllAdmins,
  deleteSuperAdmin,
};
