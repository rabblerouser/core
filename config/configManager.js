'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

const defaults = {
    session: {
        secret: "i'm a teapot",
        proxy: false,
        secureCookie: true
    }
};

let sessionConfig = () => {
    let sessionOverrides = {};

    if (config.session) {
        sessionOverrides = config.session;
    }

    if (config.session_secret_env_variable) {
        sessionOverrides.secret = process.env[config.session_secret_env_variable];
    }

    return Object.assign(defaults.session, sessionOverrides);
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
