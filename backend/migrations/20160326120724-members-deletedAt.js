'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('Members', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'deletedAt')
    .nodeify(done);
  }
};
