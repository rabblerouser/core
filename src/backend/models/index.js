'use strict';

const fs = require('fs'),
      path = require('path'),
      Sequelize = require('sequelize'),
      indexDotJs = path.basename(module.filename),
      pg = require('pg');

let db = {};

/* https://github.com/sequelize/sequelize/issues/3781 */
(function becauseOfSomeSequelizeBug() {
    delete pg.native;
})();

let connection = require(__dirname + '/../db/connection.js');

function sequelizeModelFile(filename) {
    return (filename.indexOf('.') !== 0) && (filename !== indexDotJs) && (filename.slice(-3) === '.js');
}

function lookForModelFilesInFolder(folder) {
    return fs.readdirSync(folder)
            .filter(sequelizeModelFile);
}

lookForModelFilesInFolder(__dirname)
.forEach(function(file) {
    let model = connection.import(path.join(__dirname, file));
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
