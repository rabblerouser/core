'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn("Members", "firstName", {type: Sequelize.STRING, allowNull: false}),
      queryInterface.addColumn("Members", "lastName", {type: Sequelize.STRING, allowNull: true}),
      queryInterface.addColumn("Members", "dateOfBirth", {type: Sequelize.DATE, allowNull: true}),
      queryInterface.addColumn("Members", "addressId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: "Addresses", key: "id"}
      })
    ]).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn("Members", "firstName"),
      queryInterface.removeColumn("Members", "lastName"),
      queryInterface.removeColumn("Members", "dateOfBirth"),
      queryInterface.removeColumn("Members", "addressId")
    ]).nodeify(done);
  }
};
