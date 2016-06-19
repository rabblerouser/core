'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'schoolType')
      .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Members', 'schoolType', { type: Sequelize.STRING, allowNull: true })
      .nodeify(done);
  },
};
