'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        queryInterface.changeColumn("Addresses", "postcode", {
            type: Sequelize.STRING
        }).nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        return queryInterface.sequelize.query(`ALTER TABLE "Addresses" ALTER COLUMN "postcode" TYPE integer USING (trim("postcode")::integer);`).nodeify(done);
    }
};
