'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        return queryInterface.changeColumn('Members', 'additionalInfo', {type: Sequelize.TEXT, allowNull: true})
        .nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        return queryInterface.changeColumn('Members', 'additionalInfo', {type: Sequelize.STRING(2000), allowNull: true})
        .nodeify(done);
    }
};
