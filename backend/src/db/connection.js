'use strict';

const Sequelize = require('sequelize');
const config = require(`${__dirname}/../../config/db.json`)[process.env.NODE_ENV || 'development'];
const cls = require('continuation-local-storage');

Sequelize.cls = cls.createNamespace('rabblerouser');

let connection;

if (config.use_env_variable) {
  connection = new Sequelize(process.env[config.use_env_variable]);
} else {
  connection = new Sequelize(config.database, config.username, config.password, config);
}

module.exports = connection;
