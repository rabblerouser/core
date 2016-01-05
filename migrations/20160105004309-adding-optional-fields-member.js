'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        Sequelize.Promise.all([
            queryInterface.addColumn("Members", "gender", {type: Sequelize.STRING, allowNull: true}),
            queryInterface.addColumn("Members", "secondaryPhoneNumber", {type: Sequelize.STRING, allowNull: true}),
            queryInterface.renameColumn("Members", "phoneNumber", "primaryPhoneNumber")
        ]).nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        Sequelize.Promise.all([
            queryInterface.removeColumn("Members", "gender"),
            queryInterface.removeColumn("Members", "secondaryPhoneNumber"),
            queryInterface.renameColumn("Members", "primaryPhoneNumber", "phoneNumber")
        ]).nodeify(done);
    }
};
