'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('config');

let sessionConfig = () => {
    let sessionOverrides = config.session;

    if (config.session_secret_env_variable) {
        sessionOverrides.secret = process.env[config.session_secret_env_variable];
    }

    return sessionOverrides;
};

module.exports = {
    session: sessionConfig()
};
