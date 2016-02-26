'use strict';

const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
    var Member = sequelize.define('Member', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        gender: DataTypes.STRING,
        primaryPhoneNumber: DataTypes.STRING,
        secondaryPhoneNumber: DataTypes.STRING,
        dateOfBirth: DataTypes.DATEONLY,
        membershipType: { type: DataTypes.STRING, defaultValue: 'full'},
        verified: { type : DataTypes.DATE, allowNull : true },
        verificationHash: { type : DataTypes.STRING , allowNull : true },
        memberSince: { type: DataTypes.DATEONLY, allowNull : true},
        lastRenewal: { type: DataTypes.DATEONLY, allowNull : true},
        renewalHash: { type : DataTypes.STRING , allowNull : true },
        contactFirstName: DataTypes.STRING,
        contactLastName: DataTypes.STRING,
        schoolType: { type: DataTypes.STRING, allowNull : true}
    }, {
        classMethods: {
            associate: (models) => {
                Member.belongsTo(models.Address, { as: 'postalAddress', foreignKey: 'postalAddressId' });
                Member.belongsTo(models.Address, { as: 'residentialAddress', foreignKey: 'residentialAddressId'});
                Member.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId'});
            }
        }
    });
    return Member;
};
