'use strict';
var moment = require('moment');

module.exports = {
  up: function (queryInterface, Sequelize, done) {

    return queryInterface.addColumn('Members', 'verifiedTemp', {
            type: Sequelize.DATE,
            allowNull: true
        }).then(() => {
            return queryInterface.sequelize.query(`select id from "Members" where "verified" = true`, { type: queryInterface.sequelize.QueryTypes.SELECT });
        }).tap((members) => {
            console.log(`${members.length} verified members to update...`);
        }).then((members) => {
            return Sequelize.Promise.map(members, (member) => {
                return queryInterface.sequelize.query(`update "Members" set "verifiedTemp" = :now where "id" = :id`, {
                    replacements: {
                        id: member.id,
                        now: moment().format()
                    }
                });
            });
        }).tap((result) => {
            console.log(`${result.length} records updated`);
        }).then(() => {
            return queryInterface.removeColumn('Members', 'verified');
        }).then(() => {
            return queryInterface.renameColumn('Members', 'verifiedTemp', 'verified');
        }).catch((err) => {
            console.log(err);
            throw new Error('Migration failed');
        }).nodeify(done);
  },

  down: function (queryInterface, Sequelize, done) {
    return queryInterface.addColumn('Members', 'verifiedTemp', {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }).then(() => {
            return queryInterface.sequelize.query(`select id from "Members" where "verified" is not null`, { type: queryInterface.sequelize.QueryTypes.SELECT });
        }).tap((members) => {
            console.log(`${members.length} verified members to update...`);
        }).then((members) => {
            return Sequelize.Promise.map(members, (member) => {
                return queryInterface.sequelize.query(`update "Members" set "verifiedTemp" = true where "id" = :id`, {
                    replacements: {
                        id: member.id
                    }
                });
            });
        }).tap((result) => {
            console.log(`${result.length} records updated`);
        }).then(() => {
            return queryInterface.sequelize.query(`select id from "Members" where "verified" is null`, { type: queryInterface.sequelize.QueryTypes.SELECT });
        }).tap((members) => {
            console.log(`${members.length} verified members to update...`);
        }).then((members) => {
            return Sequelize.Promise.map(members, (member) => {
                return queryInterface.sequelize.query(`update "Members" set "verifiedTemp" = false where "id" = :id`, {
                    replacements: {
                        id: member.id
                    }
                });
            });
        }).tap((result) => {
            console.log(`${result.length} records updated`);
        }).then(() => {
            return queryInterface.removeColumn('Members', 'verified');
        }).then(() => {
            return queryInterface.renameColumn('Members', 'verifiedTemp', 'verified');
        }).catch((err) => {
            console.log(err);
            throw new Error('Migration failed');
        }).nodeify(done);
  }
};
