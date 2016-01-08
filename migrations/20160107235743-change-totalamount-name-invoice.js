'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        queryInterface.renameColumn("Invoices", "totalAmount", "totalAmountInCents").nodeify(done);
  },

    down: function (queryInterface, Sequelize, done) {
        queryInterface.renameColumn("Invoices", "totalAmountInCents", "totalAmount").nodeify(done);
  }
};
