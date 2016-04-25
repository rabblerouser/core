'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('Members', 'verificationHash', {type: Sequelize.STRING, allowNull: true})
    .catch((err) => {
      console.log(err);
      throw new Error('Migration failed');
    }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('Members', 'verificationHash')
      .nodeify(done);
  }
};
