'use strict';

const bcrypt = require('bcryptjs'),
      uuid = require('node-uuid'),
      logger = require('../lib/logger');
const adminType = require('../security/adminType');

module.exports = (sequelize, DataTypes) => {
    let AdminUser = sequelize.define('AdminUser', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        email: { type: DataTypes.STRING, unique: true },
        password: DataTypes.STRING,
        type: { type: DataTypes.STRING, defaultValue: adminType.branch, allowNull: false}
    }, {
        classMethods: {
            authenticate: (email, password, passportHandler) => {
                return AdminUser.find({where: { email: email }})
                .then((user) => {
                    if (user && user.authenticate(password)) {
                        logger.info('admin-logged-in', email);
                        passportHandler(null, user.dataValues);
                        return;
                    }

                    logger.info('admin-failed-log-in', email);
                    passportHandler(null, false);
                })
                .catch((err) => {
                    logger.error('AdminUser Authenticate caught an error', err);
                });
            },
            associate: (models) => {
                AdminUser.belongsTo(models.Branch, { as: 'branch', foreignKey: 'branchId'});
            }
        },
        instanceMethods: {
            authenticate: function(password) {
                return bcrypt.compareSync(password, this.password);
            }
        }
    });

    AdminUser.hook('beforeCreate', (userAccount, options) => {
        let hash = bcrypt.hashSync(userAccount.password);
        userAccount.password = hash;
    });

    return AdminUser;
};
