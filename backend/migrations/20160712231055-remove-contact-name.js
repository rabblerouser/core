'use strict';

module.exports = {
  up: (queryInterface, Sequelize, done) => (
    Sequelize.Promise.all([
      queryInterface.removeColumn('Members', 'contactFirstName'),
      queryInterface.removeColumn('Members', 'contactLastName'),
    ]).nodeify(done)
  ),

  down: (queryInterface, Sequelize, done) => (
    Sequelize.Promise.all([
      queryInterface.addColumn('Members', 'contactFirstName', { type: Sequelize.STRING, allowNull: true }),
      queryInterface.addColumn('Members', 'contactLastName', { type: Sequelize.STRING, allowNull: true }),
    ]).nodeify(done)
  ),
};
