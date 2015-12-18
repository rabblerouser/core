'use strict';

module.exports = {
  up: (queryInterface, Sequelize, done) => {
    Sequelize.Promise.all([
      queryInterface.addColumn("Addresses", "address", {type: Sequelize.STRING, allowNull: false}),
      queryInterface.addColumn("Addresses", "suburb", {type: Sequelize.STRING, allowNull: false}),
      queryInterface.addColumn("Addresses", "state", {type: Sequelize.STRING, allowNull: false}),
      queryInterface.addColumn("Addresses", "postcode", {type: Sequelize.INTEGER, allowNull: false}),

      queryInterface.renameColumn("Members", "addressId", "residentialAddress"),
      queryInterface.addColumn("Members", "postalAddress", {type: Sequelize.INTEGER, allowNull: false})
    ]).nodeify(done);
  },

  down: (queryInterface, Sequelize, done) => {
    Sequelize.Promise.all([
      queryInterface.removeColumn("Addresses", "address"),
      queryInterface.removeColumn("Addresses", "suburb"),
      queryInterface.removeColumn("Addresses", "state"),
      queryInterface.removeColumn("Addresses", "postcode"),

      queryInterface.renameColumn("Members", "residentialAddress", "addressId"),
      queryInterface.removeColumn("Members", "postalAddress")
    ]).nodeify(done);
  }
};
