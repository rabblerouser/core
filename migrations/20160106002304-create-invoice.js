'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Invoices', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        memberEmail: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {model: 'Members', key: 'email'}
        },
        totalAmount: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        paymentDate: {
            allowNull: false,
            type: Sequelize.DATE
        },
        paymentType: {
          allowNull: false,
          type: Sequelize.STRING
        },
        reference: {
          allowNull: false,
          type: Sequelize.STRING
        }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Invoices');
  }
};
