'use strict';

module.exports = {
    up: function(queryInterface, Sequelize, done) {
        return queryInterface.createTable('Branches', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() => {
            return queryInterface.addIndex('Branches', ['id'], {});
        }).nodeify(done);
    },
    down: function(queryInterface, Sequelize, done) {
        return queryInterface.dropTable('Branches').nodeify(done);
    }
};
