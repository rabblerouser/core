'use strict';

const Sequelize = require('sequelize');
const config = require(`${__dirname}/../../config/db.json`);
const cls = require('continuation-local-storage');

Sequelize.cls = cls.createNamespace('rabblerouser');

let connection;

const dbConfig = config[process.env.NODE_ENV || 'development'];
if (dbConfig) {
  connection = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
} else {
  connection = new Sequelize(process.env.DATABASE_URL);
}

module.exports = connection;
