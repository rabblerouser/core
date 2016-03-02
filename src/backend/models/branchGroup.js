'use strict';

module.exports = (sequelize, DataTypes) => {
    var BranchGroup = sequelize.define('BranchGroup', {
        groupId: { type: DataTypes.UUID, allowNull: false },
        branchId: { type: DataTypes.UUID, allowNull: false },
    });

    return BranchGroup;
};
