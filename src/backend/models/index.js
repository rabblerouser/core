'use strict';

const fs = require('fs'),
      path = require('path'),
      Sequelize = require('sequelize'),
      basename = path.basename(module.filename),
      pg = require('pg');

/* https://github.com/sequelize/sequelize/issues/3781 */
(function becauseOfSequelizeBug() {
    delete pg.native;
})();

var db = {};

var connection = require(__dirname + '/../db/connection.js');

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = connection['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = connection;
db.Sequelize = Sequelize;

module.exports = db;
