'use strict';

const Q = require('q');
const $ = require('jquery');

const logout = function (group, labId) {
    window.location.href = '/logout';
};

export default {
    logout: logout
};
