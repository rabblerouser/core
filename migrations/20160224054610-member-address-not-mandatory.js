'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.changeColumn('Members', 'postalAddressId', {type: Sequelize.INTEGER, allowNull: true}),
      queryInterface.changeColumn('Members', 'residentialAddressId', {type: Sequelize.INTEGER, allowNull: true})
    ])
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.changeColumn('Members', 'postalAddressId', {type: Sequelize.INTEGER, allowNull: false}),
      queryInterface.changeColumn('Members', 'residentialAddressId', {type: Sequelize.INTEGER, allowNull: false})
    ])
    .nodeify(done);
  }
};
