'use strict';

let adminService = require('../services/adminService');
let logger = require('../lib/logger');
let validator = require('../lib/inputValidator');
let adminValidator = require('../lib/adminValidator');

function deleteAdmin(req, res) {
    let branchId = req.params.branchId;
    let adminId = req.params.adminId;

    if (!(validator.isValidUUID(branchId) && validator.isValidUUID(adminId))) {
        logger.error(`Failed deleting the admin with id:${adminId} and branchId: ${branchId}`);
        return res.sendStatus(400);
    }

    return adminService.delete(adminId)
    .then(() => {
        res.sendStatus(200);
    })
    .catch((error) => {
        logger.error(`Failed deleting the admin with id:${adminId} and branchId: ${branchId}}`, error);
        res.sendStatus(500);
    });
}

function parseAdmin(req) {
    let admin = {id: req.body.id};
    if (req.body.name !== undefined ) { admin.name = req.body.name; }
    if (req.body.email !== undefined) { admin.email = req.body.email; }
    if (req.body.phoneNumber !== undefined) { admin.phoneNumber = req.body.phoneNumber; }
    if (req.body.password !== undefined) { admin.password = req.body.password; }
    return admin;
}

function create(req, res) {
    let branchId = req.params.branchId;
    let newAdmin = parseAdmin(req);
    newAdmin.branchId = branchId;
    let validationErrors = adminValidator.isValid(newAdmin);

    if (validationErrors.length > 0) {
        logger.info('[create-new-user-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return adminService.create(newAdmin)
    .then((newAdmin) => {
        res.status(200).json(newAdmin);
    })
    .catch((error) => {
        logger.error(`Failed creating a new admin user: branchId: ${branchId}}`, error);
        res.sendStatus(500);
    });
}

function update(req, res) {
    let branchId = req.params.branchId;
    let admin = parseAdmin(req);
    admin.branchId = branchId;
    let validationErrors = adminValidator.isValid(admin);

    if (validationErrors.length > 0 || !admin.id || !branchId || admin.id !== req.params.id) {
        logger.info('[update-user-validation-error]', {errors: validationErrors});
        return res.status(400).json({ errors: validationErrors});
    }

    return adminService.updateAdmin(admin)
    .then((updatedAdmin) => {
        res.status(200).json(updatedAdmin);
    })
    .catch((error) => {
        logger.error(`Failed updating the admin user with id:${admin.id}`, error);
        res.sendStatus(500);
    });
}

module.exports = {
    delete: deleteAdmin,
    create: create,
    update: update
};
