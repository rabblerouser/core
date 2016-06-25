'use strict';
const uuid = require('node-uuid');
const moment = require('moment');

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.sequelize.query('delete from "Branches"')
    .nodeify(done);
  },
  down: function (queryInterface, Sequelize, done) {
    let branches = ['Gold Coast (Qld)','Northern Beaches (Frenchs Forrest, NSW)','Hornsby (NSW)','Bega (NSW)','Footscray (Vic)','Geelong (Vic)','Torquay (Vic)','Dromana (Vic)','Frankston (Vic)','Ferntree Gully (Vic)','Lilydale (Vic)','Hobart (Tas)'];
    return Sequelize.Promise.map(branches, (branch) => {
        return queryInterface.sequelize.query(`insert into "Branches" ("id", "name", "createdAt", "updatedAt", "key") values (:id, :branchName, :now, :now, :key)`, {
            replacements: {
                id: uuid.v4(),
                branchName: branch,
                now: moment().format(),
                key: uuid.v4()
            }
        });
    }).nodeify(done);
  }
};
