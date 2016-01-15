'use strict';

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/stripe-config.json')[env];

var getSecretKey = () => {
    if (config.secret_key_use_env) {
        return process.env[config.secret_key_use_env];
    }
    return config.stripe_secret_key;
};

var getPublicKey = () => {
    if (config.public_key_use_env) {
        return process.env[config.public_key_use_env];
    }
    return config.stripe_public_key;
};


module.exports = {
    getPublicKey: getPublicKey,
    getSecretKey: getSecretKey
};