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

let logFormat = () => {
    if (['development', 'test'].indexOf(env) > -1) {
        return 'dev';
    }
    else {
        return '[:date[iso]] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
    }
};

module.exports = {
    session: sessionConfig(),
    logFormat: logFormat()
};
