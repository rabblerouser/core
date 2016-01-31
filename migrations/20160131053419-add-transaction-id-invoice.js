'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn("Invoices", "transactionId", {
          type: Sequelize.STRING,
          allowNull: true
      }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
          queryInterface.removeColumn("Invoices", "transactionId")
      ]).nodeify(done);
  }
};
