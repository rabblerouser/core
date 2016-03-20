'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
      queryInterface.addColumn('AdminUsers', 'type', {
        type: Sequelize.STRING,
        allowNull: true
    })
    .then(() => {
        return queryInterface.sequelize.query(`update "AdminUsers" set type = 'BRANCH'`);
    })
    .tap(() => console.log('All records in AdminUsers were updated'))
    .then(() => {
      return queryInterface.changeColumn('AdminUsers', 'type', {type: Sequelize.STRING, allowNull: false});
    }).catch((err) => {
      console.log(err);
      throw new Error('Migration failed');
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('AdminUsers', 'type')
    .nodeify(done);
  }
};
