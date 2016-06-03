'use strict';

module.exports = (sequelize, DataTypes) => {
  const BranchGroup = sequelize.define('BranchGroup', {
    groupId: { type: DataTypes.UUID, allowNull: false },
    branchId: { type: DataTypes.UUID, allowNull: false },
  }, { paranoid: true });

  return BranchGroup;
};
