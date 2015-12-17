'use strict';
module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define('Address', {
    country: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Address.belongsTo(models.Member, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Address;
};