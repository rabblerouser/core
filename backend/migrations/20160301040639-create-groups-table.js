'use strict';

module.exports = {
    up: function(queryInterface, Sequelize, done) {
        return queryInterface.createTable('Groups', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        }).nodeify(done);
    },
    down: function(queryInterface, Sequelize, done) {
        return queryInterface.dropTable('Groups').nodeify(done);
    }
};
