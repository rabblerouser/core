'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
        queryInterface.addColumn('Branches', 'notes', {type: Sequelize.STRING(2000), allowNull: true}),
        queryInterface.addColumn('Branches', 'contact', {type: Sequelize.STRING, allowNull: true})
      ]).nodeify(done);
  },
  down: function (queryInterface, Sequelize, done) {
      Sequelize.Promise.all([
        queryInterface.removeColumn('Branches', 'notes'),
        queryInterface.removeColumn('Branches', 'contact')
      ]).nodeify(done);
  }
};
