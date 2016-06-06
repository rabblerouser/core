'use strict';

const bcrypt = require('bcryptjs');
const uuid = require('node-uuid');
const logger = require('../lib/logger');
const adminType = require('../security/adminType');

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    name: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING, defaultValue: adminType.branch, allowNull: false },
  }, {
    classMethods: {
      authenticate: (email, password, passportHandler) =>
        AdminUser.find({ where: { email } })
          .then(user => {
            if (user && user.authenticate(password)) {
              logger.info('admin-logged-in', email);
              passportHandler(null, user.dataValues);
              return;
            }

            logger.info('admin-failed-log-in', email);
            passportHandler(null, false);
          })
          .catch(err => {
            logger.error('AdminUser Authenticate caught an error', err);
          }),
      associate: models => {
        AdminUser.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId' });
      },
    },
    instanceMethods: {
      authenticate(password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  });

  AdminUser.hook('beforeCreate', userAccount => {
    userAccount.password = bcrypt.hashSync(userAccount.password);
  });

  AdminUser.hook('beforeUpdate', userAccount => {
    if (userAccount.changed('password')) {
      userAccount.password = bcrypt.hashSync(userAccount.password);
    }
  });

  return AdminUser;
};
