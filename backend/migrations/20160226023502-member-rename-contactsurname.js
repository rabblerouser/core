'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
        queryInterface.renameColumn('Members', 'contactSurname', 'contactLastName'),
        queryInterface.addColumn('Members', 'schoolType', {type: Sequelize.STRING, allowNull: true})
    ])
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
        queryInterface.renameColumn('Members', 'contactLastName', 'contactSurname'),
        queryInterface.removeColumn('Members', 'schoolType')
    ])
    .nodeify(done);
  }
};
