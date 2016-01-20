'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.changeColumn("Invoices", "paymentStatus", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Pending'
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.changeColumn("Invoices", "paymentStatus", {
      type: Sequelize.STRING,
      allowNull: false
    }).nodeify(done);
  }
};
