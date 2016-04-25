'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('Addresses', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Addresses', 'deletedAt')
    .nodeify(done);
  }
};
