'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn('Members', 'memberSince', {type: Sequelize.DATE, allowNull: true}),
      queryInterface.addColumn('Members', 'renewalHash', {type: Sequelize.STRING, allowNull: true}),
      queryInterface.addColumn('Members', 'lastRenewal', {type: Sequelize.DATE, allowNull: true})
    ]).then(() => {
        return queryInterface.sequelize.query('update "Members" set "memberSince" = "createdAt"');
    })
    .then(() => {
        return queryInterface.changeColumn('Members', 'memberSince', {type: Sequelize.DATE ,allowNull: false});
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn('Members', 'memberSince'),
      queryInterface.removeColumn('Members', 'renewalHash'),
      queryInterface.removeColumn('Members', 'lastRenewal')
    ]).nodeify(done);
  }
};
