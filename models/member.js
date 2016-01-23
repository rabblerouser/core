'use strict';

const uuid = require("node-uuid");

module.exports = (sequelize, DataTypes) => {
    var Member = sequelize.define('Member', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4() },
        email: { type: DataTypes.STRING, primaryKey: true },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        gender: DataTypes.STRING,
        primaryPhoneNumber: DataTypes.STRING,
        secondaryPhoneNumber: DataTypes.STRING,
        dateOfBirth: DataTypes.DATEONLY,
        membershipType: DataTypes.STRING
    }, {
        classMethods: {
            associate: (models) => {
                models.Address.hasOne(Member, {foreignKey: "postalAddress"});
                models.Address.hasOne(Member, {foreignKey: "residentialAddress"});
            }
        }
    });
    return Member;
};
