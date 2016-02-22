'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
     queryInterface.dropTable('Invoices')
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"');
    })
    .then(() => {
       return queryInterface.sequelize.query('ALTER TABLE "Members" ADD CONSTRAINT "Members_pkey" PRIMARY KEY(id)');
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {

    queryInterface.createTable('Invoices', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        memberEmail: {
          type: Sequelize.STRING,
          allowNull: false
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
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"');
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" ADD PRIMARY KEY (email)');
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_memberEmail_fkey" FOREIGN KEY ("memberEmail") REFERENCES "Members" (email) MATCH FULL');
    })
    .nodeify(done);
  }
};

