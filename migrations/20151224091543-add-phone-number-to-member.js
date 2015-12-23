'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn("Members", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: false
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn("Members", "phoneNumber").nodefiy(done);
  }
};
