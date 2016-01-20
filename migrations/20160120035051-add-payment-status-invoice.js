'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn("Invoices", "paymentStatus", {
      type: Sequelize.STRING,
      allowNull: false
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn("Invoices", "paymentStatus")
    ]).nodeify(done);
  }
};
