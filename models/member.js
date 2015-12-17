'use strict';

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define('Member', {
      email: DataTypes.STRING,
      primaryKey: true
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Member;
};
