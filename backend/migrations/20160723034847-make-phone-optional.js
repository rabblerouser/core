'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.sequelize.query(`ALTER TABLE "Members" ALTER COLUMN "primaryPhoneNumber" DROP NOT NULL`).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.sequelize.query(`ALTER TABLE "Members" ALTER COLUMN "primaryPhoneNumber" SET NOT NULL`).nodeify(done);
  }
};
