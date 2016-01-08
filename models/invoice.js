'use strict';

module.exports = (sequelize, DataTypes) => {
  var Invoice = sequelize.define('Invoice', {
    memberEmail: DataTypes.STRING,
    totalAmountInCents: DataTypes.BIGINT,
    paymentDate:  DataTypes.DATEONLY,
    paymentType: DataTypes.STRING,
    reference: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });
  return Invoice;
};
