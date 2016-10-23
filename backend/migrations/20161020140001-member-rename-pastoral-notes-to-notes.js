'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.renameColumn('Members', 'pastoralNotes', 'notes')
    .nodeify(done);
  },
  down: function (queryInterface, Sequelize, done) {
    queryInterface.renameColumn('Members', 'notes', 'pastoralNotes')
    .nodeify(done);
  }
};
