'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.addColumn('Members', 'contactFirstName', {type: Sequelize.STRING, allowNull: true}),
      queryInterface.addColumn('Members', 'contactSurname', {type: Sequelize.STRING, allowNull: true})
    ]).then(() => {
        return queryInterface.changeColumn('Members', 'memberSince', {type: Sequelize.DATE ,allowNull: true});
    })
    .nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    Sequelize.Promise.all([
      queryInterface.removeColumn('Members', 'contactFirstName'),
      queryInterface.removeColumn('Members', 'contactSurname'),
      queryInterface.changeColumn('Members', 'memberSince', {type: Sequelize.DATE ,allowNull: false})
    ]).nodeify(done);
  }
};
