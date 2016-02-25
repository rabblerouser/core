'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn('Branches', 'postalAddressId'),
      queryInterface.removeColumn('Branches', 'residentialAddressId'),
      queryInterface.addColumn('Branches', 'key', {type: Sequelize.UUID, allowNull: false})
    ])
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn('Branches', 'postalAddressId', {type: Sequelize.INTEGER, allowNull: true}),
      queryInterface.addColumn('Branches', 'residentialAddressId', {type: Sequelize.INTEGER, allowNull: true}),
      queryInterface.removeColumn('Branches', 'key')
    ])
    .nodeify(done);
  }
};
