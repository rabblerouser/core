'use strict';

module.exports = (sequelize, DataTypes) => {
  var Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    memberEmail: DataTypes.STRING,
    totalAmountInCents: DataTypes.BIGINT,
    paymentDate:  DataTypes.DATEONLY,
    paymentType: DataTypes.STRING,
    reference: DataTypes.STRING,
    paymentStatus: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
      }
    }
  });
  return Invoice;
};
