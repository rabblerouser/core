'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        Sequelize.Promise.all([
            queryInterface.addColumn("Invoices", "createdAt", {type: Sequelize.DATE, allowNull: false}),
            queryInterface.addColumn("Invoices", "updatedAt", {type: Sequelize.DATE, allowNull: false}),
        ]).nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        Sequelize.Promise.all([
            queryInterface.removeColumn("Invoices", "createdAt"),
            queryInterface.removeColumn("Invoices", "updatedAt")
        ]).nodeify(done);
    }
};
