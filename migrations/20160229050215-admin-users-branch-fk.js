'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.addColumn('AdminUsers', 'branchId', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {model: 'Branches', key: 'id'}
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    return queryInterface.removeColumn('AdminUsers', 'branchId').nodeify(done);
  }
};
