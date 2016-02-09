'use strict';

const memberService = require('./memberService');
const moment = require('moment');
const logger = require('../lib/logger');
const humanInterval = require('human-interval');

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
    setInterval(remindMembersToRenew, humanInterval('24 hours'));
}

function start() {
    remindMembersToRenew()
    .finally(setupRecurrentJob);
}

module.exports = {
    start : start
};