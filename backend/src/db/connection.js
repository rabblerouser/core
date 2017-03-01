'use strict';

const Sequelize = require('sequelize');
const config = require('../../config/config')[process.env.NODE_ENV || 'development'];
const cls = require('continuation-local-storage');

Sequelize.cls = cls.createNamespace('rabblerouser');

module.exports = new Sequelize(process.env[config.use_env_variable], config);
