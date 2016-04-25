'use strict';

module.exports = {
    up: function(queryInterface, Sequelize, done) {
        return queryInterface.createTable('GroupMembers', {
            groupId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {model: 'Groups', key: 'id'}
            },
            memberId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {model: 'Members', key: 'id'}
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
        return queryInterface.dropTable('GroupMembers').nodeify(done);
    }
};
