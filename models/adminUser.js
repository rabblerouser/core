'use strict';

const bcrypt = require('bcryptjs'),
      uuid = require('node-uuid'),
      logger = require('../lib/logger');

module.exports = (sequelize, DataTypes) => {
    let AdminUser = sequelize.define('AdminUser', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        email: { type: DataTypes.STRING, unique: true },
        password: DataTypes.STRING
    }, {
        classMethods: {
            authenticate: (email, password, cb) => {
                return AdminUser.find({where: { email: email }})
                    .then((user) => {
                        if (user) {
                            if (user.authenticate(password)) {
                                logger.logInfoEvent('admin-logged-in', email);
                                cb(null, user.dataValues);
                            }
                            else {
                                logger.logInfoEvent('admin-failed-log-in', email);
                                cb(null, false);
                            }
                        }
                        else {
                            logger.logInfoEvent('admin-failed-log-in', email);
                            cb(null, false);
                        }
                    })
                    .catch((err) => {
                        logger.logError(err, 'AdminUser Authenticate caught an error');
                    });
            }
        },
        instanceMethods: {
            // needs to use function syntax because arrow functions clobber this
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
