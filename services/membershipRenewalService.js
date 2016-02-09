'use strict';

const every24Hours = 86400000;
const memberService = require('./memberService');
const moment = require('moment');
const logger = require('../lib/logger');

function membershipsExpiringSoon() {
    const in90Days = moment().add(90, 'days').format('L');

    return memberService.findMembershipsExpiringOn(in90Days);
}

function remindMembersToRenew() {
    return membershipsExpiringSoon()
    .then(memberService.notifyExpiringMembers)
    .catch((error) => {
        logger.logError(error.toString(), '[memberships-renewal-task-error]');
    });
}

function setupRecurrentJob() {
    logger.logInfoEvent('[renewal-task-setup]');
    setInterval(remindMembersToRenew, every24Hours);
}

function start() {
    remindMembersToRenew()
    .finally(setupRecurrentJob);
}

module.exports = {
    start : start
};