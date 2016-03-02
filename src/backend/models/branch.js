'use strict';

const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
    var Branch = sequelize.define('Branch', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: (models) => {
                Branch.belongsToMany(models.Group, { through: 'BranchGroups', foreignKey: 'branchId' });
            }
        }
    });

    return Branch;
};
