'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('Branches', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Branches', 'deletedAt')
    .nodeify(done);
  }
};
