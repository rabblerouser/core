'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'dateOfBirth')
      .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Members', 'dateOfBirth', { type: Sequelize.DATEONLY, allowNull: true })
      .nodeify(done);
  },
};
