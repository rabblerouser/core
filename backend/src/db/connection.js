'use strict';

let Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/db.json')[env];

let cls = require('continuation-local-storage');
Sequelize.cls = cls.createNamespace('lab-assistant');

var connection;

if (config.use_env_variable) {
    connection = new Sequelize(process.env[config.use_env_variable]);
} else {
    connection = new Sequelize(config.database, config.username, config.password, config);
}

module.exports = connection;
