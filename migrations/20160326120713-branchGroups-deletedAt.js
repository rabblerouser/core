'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('BranchGroups', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('BranchGroups', 'deletedAt')
    .nodeify(done);
  }
};
