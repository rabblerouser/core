'use strict';

const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    primaryPhoneNumber: DataTypes.STRING,
    secondaryPhoneNumber: DataTypes.STRING,
    membershipType: { type: DataTypes.STRING, defaultValue: 'full' },
    memberSince: { type: DataTypes.DATE, allowNull: false },
    additionalInfo: { type: DataTypes.TEXT, allowNull: true },
    pastoralNotes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    paranoid: true,
    classMethods: {
      associate: models => {
        Member.belongsTo(models.Address, { as: 'postalAddress', foreignKey: 'postalAddressId' });
        Member.belongsTo(models.Address, { as: 'residentialAddress', foreignKey: 'residentialAddressId' });
        Member.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId' });
        Member.belongsToMany(models.Group, { as: 'groups', through: 'GroupMembers', foreignKey: 'memberId' });
      },
    },
  });
  return Member;
};
