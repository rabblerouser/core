'use strict';

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define('Address', {
    country: DataTypes.STRING,
    address: DataTypes.STRING,
    suburb: DataTypes.STRING,
    state: DataTypes.STRING,
    postcode: {type: DataTypes.STRING, validate: {len: [4,4]}}
  }, {
    classMethods: {
      associate: (models) => {
          Address.hasOne(models.Member, {foreignKey: "postalAddressId"});
          Address.hasOne(models.Member, {foreignKey: "residentialAddressId"});
      }
    }
  });
  return Address;
};
