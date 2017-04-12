'use strict';

const uuid = require('node-uuid');
const hash = require('../security/hash');
const logger = require('../lib/logger');
const adminValidator = require('../lib/adminValidator');
const adminType = require('../security/adminType');
const streamClient = require('../streamClient');
const store = require('../store');

const mapAdmin = admin => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  phoneNumber: admin.phoneNumber,
});

const getBranchAdmins = (req, res) => {
  const admins = store.getAdmins()
    .filter(admin => admin.branchId === req.params.branchId)
    .map(mapAdmin);
  res.status(200).json({ admins });
};

const getSuperAdmins = (req, res) => {
  const admins = store.getAdmins()
    .filter(admin => admin.type === adminType.super)
    .map(mapAdmin);
  res.status(200).json({ admins });
};

const createAdmin = type => (req, res) => {
  const branchId = req.params.branchId;
  const admin = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    type,
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

const deleteAdmin = (req, res) => {
  const adminId = req.params.adminId;
  return streamClient.publish('admin-removed', { id: adminId })
    .then(() => res.sendStatus(200))
    .catch(error => {
      logger.error(`Failed deleting the admin with id:${adminId}`, error);
      res.sendStatus(500);
    });
};

module.exports = {
  getBranchAdmins,
  getSuperAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
