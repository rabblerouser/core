'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn("Invoices", "totalAmount", "totalAmountInCents")
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn("Invoices", "totalAmountInCents", "totalAmount")
  }
};
