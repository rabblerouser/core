'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

const defaults = {
    session: {
        secret: "i'm a teapot",
        proxy: true,
        secureCookie: true
    }
}

let sessionConfig = () => {
    let sessionOverrides = {};

    if (config.session) {
        sessionOverrides = config.session;
    }

    if (config.session_secret_env_variable) {
        sessionOverrides.secret = process.env[config.session_secret_env_variable];
    }

    return Object.assign(defaults.session, sessionOverrides);
}

module.exports = {
    session: sessionConfig()
}
