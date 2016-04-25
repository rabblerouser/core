'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Members', 'additionalInfo', {type: Sequelize.STRING, allowNull: true})
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'additionalInfo')
    .nodeify(done);
  }
};
