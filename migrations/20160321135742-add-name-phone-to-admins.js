'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
        queryInterface.addColumn('AdminUsers', 'name', {type: Sequelize.STRING, allowNull: true}),
        queryInterface.addColumn('AdminUsers', 'phoneNumber', {type: Sequelize.STRING, allowNull: true})
      ]).nodeify(done);
  },
  down: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
        queryInterface.removeColumn('AdminUsers', 'name'),
        queryInterface.removeColumn('AdminUsers', 'phoneNumber')
      ]).nodeify(done);
  }
};
