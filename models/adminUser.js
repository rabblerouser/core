'use strict';

const bcrypt = require('bcryptjs'),
      uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
    let AdminUser = sequelize.define('AdminUser', {
        id: { type: DataTypes.UUID, defaultValue: uuid.v4(), primaryKey: true },
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        classMethods: {
            authenticate: (email, password, cb) => {
                return AdminUser.find({ email: email })
                    .then((user) => {
                        if (user) {
                            if (user.authenticate(password)) {
                                // log this event
                                cb(null, user.dataValues);
                            }
                            else {
                                // log this event
                                cb(null, false);
                            }
                        }
                        else {
                            // log this event
                            cb(null, false);
                        }
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
