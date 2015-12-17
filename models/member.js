'use strict';

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define('Member', {
    email: {type: DataTypes.STRING, primaryKey: true},
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Member.hasMany(models.Address)
        // associations can be defined here
      }
    }
  });
  return Member;
};
