'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn("Invoices", "createdAt", {type: Sequelize.DATE, allowNull: false}),
      queryInterface.addColumn("Invoices", "updatedAt", {type: Sequelize.DATE, allowNull: false}),
    ]).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn("Invoices", "createdAt").nodefiy(done);
    queryInterface.removeColumn("Invoices", "updatedAt").nodefiy(done);
  }
};
