'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('AdminUsers', {
          id: {
              allowNull: false,
              type: Sequelize.UUID,
              primaryKey: true

          },
          email: {
              type: Sequelize.STRING,
              allowNull: false
          },
          password: {
              type: Sequelize.STRING,
              allowNull: false
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
          }
      }).then(() => {
          queryInterface.addIndex('AdminUsers', ['email']);
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('AdminUsers');
  }
};
