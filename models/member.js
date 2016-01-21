'use strict';

module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    email: {type: DataTypes.STRING, primaryKey: true},
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    primaryPhoneNumber: DataTypes.STRING,
    secondaryPhoneNumber: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    membershipType: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        models.Address.hasOne(Member, {foreignKey: "postalAddress"});
        models.Address.hasOne(Member, {foreignKey: "residentialAddress"});
      }
    }
  });
  return Member;
};
