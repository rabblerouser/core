'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.sequelize.query('update "Members" set "lastRenewal" = "memberSince"')
    .catch((err) => {
        console.log(err);
        throw new Error('Migration failed');
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    return queryInterface.sequelize.query('update "Members" set "lastRenewal" = NULL')
    .catch((err) => {
        console.log(err);
        throw new Error('Migration failed');
    }).nodeify(done);
  }
};
