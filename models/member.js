'use strict';

module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    email: {type: DataTypes.STRING, primaryKey: true},
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE
  }, {
    classMethods: {
      associate: (models) => {
        Member.hasOne(models.Address, {as: 'residentialAddress'});
        Member.hasOne(models.Address, {as: 'postalAddress'});
      }
    }
  });
  return Member;
};
