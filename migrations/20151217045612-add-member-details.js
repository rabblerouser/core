'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("Members", "firstName", {type: Sequelize.STRING, allowNull: false});
    queryInterface.addColumn("Members", "lastName", {type: Sequelize.STRING, allowNull: true});
    queryInterface.addColumn("Members", "dateOfBirth", {type: Sequelize.DATE, allowNull: true});
    return queryInterface.addColumn("Members", "addressId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {model: "Addresses", key: "id"}
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn("Members", "firstName");
    queryInterface.removeColumn("Members", "lastName");
    queryInterface.removeColumn("Members", "dateOfBirth");
    return queryInterface.removeColumn("Members", "addressId");
  }
};
