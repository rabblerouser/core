'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Members', 'verified', {type: Sequelize.BOOLEAN, allowNull: true})
    .then(() => {
        return queryInterface.sequelize.query(`update "Members" set verified = true`);
    })
    .tap(() => console.log('All records in Members were updated'))
    .then(() => {
      return queryInterface.changeColumn('Members', 'verified', {type: Sequelize.BOOLEAN, allowNull: false});
    }).catch((err) => {
      console.log(err);
      throw new Error('Migration failed');
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'verified')
      .nodeify(done);
  }
};
