'use strict';

module.exports = (sequelize, DataTypes) => {
  var Address = sequelize.define('Invoice', {
    memberEmail: DataTypes.STRING,
    totalAmount: DataTypes.BIGINT,
    paymentDate:  DataTypes.DATEONLY,
    paymentType: DataTypes.STRING,
    reference: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });
  return Address;
};
