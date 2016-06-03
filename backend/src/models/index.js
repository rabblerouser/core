'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const indexDotJs = path.basename(module.filename);
const pg = require('pg');
const db = {};

/* https://github.com/sequelize/sequelize/issues/3781 */
(function becauseOfSomeSequelizeBug() {
  delete pg.native;
}());

const connection = require(`${__dirname}/../db/connection.js`);

function sequelizeModelFile(filename) {
  return (filename.indexOf('.') !== 0) && (filename !== indexDotJs) && (filename.slice(-3) === '.js');
}

function lookForModelFilesInFolder(folder) {
  return fs.readdirSync(folder).filter(sequelizeModelFile);
}

lookForModelFilesInFolder(__dirname)
  .forEach(file => {
    const model = connection.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = connection;
db.Sequelize = Sequelize;

module.exports = db;
