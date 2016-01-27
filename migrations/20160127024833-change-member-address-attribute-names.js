'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.renameColumn("Members", "residentialAddress", "residentialAddressId"),
            queryInterface.renameColumn("Members", "postalAddress", "postalAddressId")
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            queryInterface.renameColumn("Members", "residentialAddressId", "residentialAddress"),
            queryInterface.renameColumn("Members", "postalAddressId", "postalAddress")
        ]);
    }
};
