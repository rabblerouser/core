'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.addColumn('Members', 'branchId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {model: 'Branches', key: 'id'}
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    return queryInterface.removeColumn('Members', 'branchId').nodeify(done);
  }
};
