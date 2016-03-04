'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn('Members', 'lastRenewal'),
      queryInterface.removeColumn('Members', 'renewalHash'),
      queryInterface.removeColumn('Members', 'verificationHash'),
      queryInterface.removeColumn('Members', 'verified')
    ]).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn('Members', 'renewalHash', {type: Sequelize.STRING, allowNull: true}),
      queryInterface.addColumn('Members', 'lastRenewal', {type: Sequelize.DATE, allowNull: true}),
      queryInterface.addColumn('Members', 'verificationHash', {type: Sequelize.STRING, allowNull: true}),
      queryInterface.addColumn('Members', 'verified', {type: Sequelize.DATE, allowNull: true})
    ]).nodeify(done);
  }
};
