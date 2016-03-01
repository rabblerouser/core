'use strict';

const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
    var Group = sequelize.define('Group', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        name: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
      classMethods: {
        associate: (models) => {
            Group.belongsToMany(models.Member, {through: 'GroupMembers', foreignKey: 'groupId'});
            Group.belongsToMany(models.Branch, { through: 'BranchGroups', foreignKey: 'groupId' });
        }
      }
    });

    return Group;
};
