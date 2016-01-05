'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        queryInterface.changeColumn("Addresses", "postcode", {
            type: Sequelize.STRING
        }).nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        queryInterface.changeColumn("Addresses", "postcode", {
            type: Sequelize.INTEGER
        }).nodeify(done);
    }
};
