"use strict";

const uuid = require('node-uuid');

module.exports = {
    up: function (queryInterface, Sequelize, done) {
        return queryInterface.addColumn("Members", "id", {
            type: Sequelize.UUID,
            allowNull: true
        }).then(() => {
            return queryInterface.addIndex("Members", ["id"], {});
        }).then(() => {
            return queryInterface.sequelize.query(`select email from "Members"`, { type: queryInterface.sequelize.QueryTypes.SELECT });
        }).tap((members) => {
            console.log(`${members.length} records to update...`);
        }).then((members) => {
            return Sequelize.Promise.map(members, (member) => {
                return queryInterface.sequelize.query(`update "Members" set id = :id where email = :email`, {
                    replacements: {
                        id: uuid.v4(),
                        email: member.email
                    }
                });
            });
        }).tap((result) => {
            console.log(`${result.length} records updated`);
        }).then((result) => {
            return queryInterface.changeColumn("Members", "id", {
                type: Sequelize.UUID,
                allowNull: false
            });
        }).catch((err) => {
            console.log(err);
            throw new Error("Migration failed");
        }).nodeify(done);
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeIndex("Members", "id")
            .then(() => {
                return queryInterface.removeColumn("Members", "id");
            });
    }
};
