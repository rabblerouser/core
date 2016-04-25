'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn("Members", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: false
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
          queryInterface.removeColumn("Members", "phoneNumber")
      ]).nodeify(done);
  }
};
