'use strict';

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define('Address', {
    country: DataTypes.STRING,
    address: DataTypes.STRING,
    suburb: DataTypes.STRING,
    state: DataTypes.STRING,
    postcode: {type: DataTypes.INTEGER, validate: {len: [4,4]}}
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });
  return Address;
};