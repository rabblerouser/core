'use strict';

const uuid = require('node-uuid');
const hash = require('../security/hash');
const adminService = require('../services/adminService');
const logger = require('../lib/logger');
const validator = require('../lib/inputValidator');
const adminValidator = require('../lib/adminValidator');
const adminType = require('../security/adminType');
const streamClient = require('../streamClient');
const store = require('../store');

const findBranch = branchId => store.getBranches().find(branch => branch.id === branchId);

const createBranchAdmin = (req, res) => {
  const branchId = req.params.branchId;
  if (!findBranch(branchId)) {
    return res.sendStatus(404);
  }

  const admin = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password || '',
    type: adminType.branch,
    branchId,
  };
  const validationErrors = adminValidator.isValid(admin);
  admin.password = hash(admin.password || '');

  if (validationErrors.length > 0) {
    logger.info('[create-new-admin-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }
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
      logger.error(`Failed creating a new admin user for branch: ${branchId}}`, error);
      return res.sendStatus(500);
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

function parseAdmin(req) {
  const admin = {};
  if (req.body.name !== undefined) { admin.name = req.body.name; }
  if (req.body.email !== undefined) { admin.email = req.body.email; }
  if (req.body.phoneNumber !== undefined) { admin.phoneNumber = req.body.phoneNumber; }
  if (req.body.password !== undefined) { admin.password = req.body.password; }
  return admin;
}

function createSuperAdmin(req, res) {
  const admin = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password || '',
    type: adminType.super,
  };
  const validationErrors = adminValidator.isSuperAdminValid(admin);
  admin.password = hash(admin.password || '');

  if (validationErrors.length > 0) {
    logger.info('[create-new-admin-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return streamClient.publish('admin-created', admin)
    .then(() => res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      type: admin.type,
    }))
    .catch(error => {
      logger.error('Failed creating a new super admin', error);
      return res.sendStatus(500);
    });
}

function updateSuperAdmin(req, res) {
  const admin = parseAdmin(req);
  admin.id = req.body.id;

  if (!admin.id || admin.id !== req.params.adminId) {
    logger.info('[update-user-validation-error]', { errors: ['invalid params'] });
    return res.status(400).json({ errors: ['invalid params'] });
  }

  const validationErrors = adminValidator.isSuperAdminValidWithoutPassword(admin);
  if (validationErrors.length > 0) {
    logger.info('[update-user-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return adminService.updateAdmin(admin)
  .then(updatedAdmin => res.status(200).json(updatedAdmin))
  .catch(error => {
    logger.error(`Failed updating the admin user with id:${admin.id}`, error);
    res.sendStatus(500);
  });
}

function updateBranchAdmin(req, res) {
  const branchId = req.params.branchId;
  const admin = parseAdmin(req);
  admin.branchId = branchId;
  admin.id = req.body.id;

  if (!admin.id || !branchId || admin.id !== req.params.id) {
    logger.info('[update-user-validation-error]', { errors: ['invalid params'] });
    return res.status(400).json({ errors: ['invalid params'] });
  }

  const validationErrors = adminValidator.isValidWithoutPassword(admin);
  if (validationErrors.length > 0) {
    logger.info('[update-user-validation-error]', { errors: validationErrors });
    return res.status(400).json({ errors: validationErrors });
  }

  return adminService.updateAdmin(admin)
  .then(updatedAdmin => res.status(200).json(updatedAdmin))
  .catch(error => {
    logger.error(`Failed updating the admin user with id:${admin.id}`, error);
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
  createBranchAdmin,
  updateBranchAdmin,
  deleteBranchAdmin,
  getAllAdmins,
  createSuperAdmin,
  deleteSuperAdmin,
  updateSuperAdmin,
};
