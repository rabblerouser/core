'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn('Branches', 'postalAddressId', {type: Sequelize.INTEGER, allowNull: true}),
      queryInterface.addColumn('Branches', 'residentialAddressId', {type: Sequelize.INTEGER, allowNull: true})
    ])
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn('Branches', 'postalAddressId', {type: Sequelize.INTEGER, allowNull: true}),
      queryInterface.removeColumn('Branches', 'residentialAddressId', {type: Sequelize.INTEGER, allowNull: true})
    ])
    .nodeify(done);
  }
};
