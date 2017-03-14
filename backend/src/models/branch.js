'use strict';

const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
    name: DataTypes.STRING,
    notes: new DataTypes.STRING(2000),
    contact: DataTypes.STRING,
    key: { type: DataTypes.UUID, defaultValue: uuid.v4() },
  }, {
    paranoid: true,
  });

  return Branch;
};
