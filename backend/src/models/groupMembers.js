'use strict';

module.exports = (sequelize, DataTypes) => {
  const GroupMembers = sequelize.define('GroupMembers', {
    groupId: { type: DataTypes.UUID, allowNull: false },
    memberId: { type: DataTypes.UUID, allowNull: false },
  }, { paranoid: true });

  return GroupMembers;
};
