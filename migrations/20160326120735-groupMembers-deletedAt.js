'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('GroupMembers', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('GroupMembers', 'deletedAt')
    .nodeify(done);
  }
};
