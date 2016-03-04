'use strict';

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        return queryInterface.changeColumn('Members', 'additionalInfo', {type: Sequelize.STRING, length: 2000, allowNull: true})
        .nodeify(done);
    },

    down: function (queryInterface, Sequelize, done) {
        return queryInterface.changeColumn('Members', 'additionalInfo', {type: Sequelize.STRING, allowNull: true})
        .nodeify(done);
    }
};
