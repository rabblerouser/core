'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.sequelize.query('ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_memberEmail_fkey"')
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"');
    })
    .then(() => {
       return queryInterface.sequelize.query('ALTER TABLE "Members" ADD CONSTRAINT "Members_pkey" PRIMARY KEY(id)');
    })
    .then(() => {
      return queryInterface.addColumn('Invoices', 'memberId', {
          type: Sequelize.UUID,
          allowNull: false
      });
    })
    .then(() => {
      return queryInterface.removeColumn('Invoices', 'memberEmail');
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Members" (id) MATCH FULL');
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.sequelize.query('ALTER TABLE "Invoices" DROP CONSTRAINT "Invoices_memberId_fkey"')
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"');
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" ADD PRIMARY KEY (email)');
    })
    .then(() => {
      return queryInterface.addColumn('Invoices', 'memberEmail', {
          type: Sequelize.STRING,
          allowNull: false
      });
    })
    .then(() => {
      return queryInterface.removeColumn('Invoices', 'memberId');
    })
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_memberEmail_fkey" FOREIGN KEY ("memberEmail") REFERENCES "Members" (email) MATCH FULL');
    })
    .nodeify(done);
  }
};
