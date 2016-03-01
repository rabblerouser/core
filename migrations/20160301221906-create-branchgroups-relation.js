'use strict';

module.exports = {
    up: function(queryInterface, Sequelize, done) {
        return queryInterface.createTable('BranchGroups', {
            groupId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {model: 'Groups', key: 'id'}
            },
            branchId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {model: 'Branches', key: 'id'}
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
        return queryInterface.dropTable('BranchGroups').nodeify(done);
    }
};
