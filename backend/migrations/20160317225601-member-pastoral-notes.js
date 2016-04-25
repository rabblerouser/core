'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('Members', 'pastoralNotes', {
        type: Sequelize.STRING(2000),
        allowNull: true
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'pastoralNotes')
    .nodeify(done);
  }
};
