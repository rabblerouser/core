'use strict';

module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    email: {type: DataTypes.STRING, primaryKey: true},
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY
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
