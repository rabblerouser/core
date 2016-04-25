'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"')
    .then(() => {
       return queryInterface.sequelize.query('ALTER TABLE "Members" ADD CONSTRAINT "Members_pkey" PRIMARY KEY(id)');
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {

    queryInterface.sequelize.query('ALTER TABLE "Members" DROP CONSTRAINT "Members_pkey"')
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "Members" ADD PRIMARY KEY (email)');
    })
    .nodeify(done);
  }
};

