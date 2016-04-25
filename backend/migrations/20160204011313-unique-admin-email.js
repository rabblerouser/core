'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        queryInterface.sequelize.query(`ALTER TABLE "AdminUsers" ADD CONSTRAINT "uniqueEmail" UNIQUE("email")`).nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        queryInterface.sequelize.query(`ALTER TABLE "AdminUsers" DROP CONSTRAINT "uniqueEmail"`).nodeify(done);
    }
};
