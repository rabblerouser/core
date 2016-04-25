'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn("Members", "membershipType", {
      type: Sequelize.STRING,
      defaultValue: "full",
      allowNull: false
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
          queryInterface.removeColumn("Members", "membershipType")
      ]).nodeify(done);
  }
};
