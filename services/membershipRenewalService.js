'use strict';

const memberService = require('./memberService');
const moment = require('moment');
const logger = require('../lib/logger');
const CronJob = require('cron').CronJob;
const everyDayAt7_30am = '00 1 1 * * *';

function membershipsExpiringSoon() {
    const in90Days = moment().add(90, 'days').format('L');

    return memberService.findMembershipsExpiringOn(in90Days);
}

function remindMembersToRenew() {
    return membershipsExpiringSoon()
    .then(memberService.notifyExpiringMembers)
    .catch((error) => {
        logger.logError(error.toString(), '[renewal-notification-job-failed]');
    });
}

function start() {
    let job = new CronJob({
      cronTime: everyDayAt7_30am,
      onTick: function() {
        logger.logInfoEvent('[renewal-notification-job-started]');

        remindMembersToRenew()
        .then((result) => logger.logInfoEvent('[renewal-notification-job-finished]', `Notifications sent: ${result.length}`));
      },
      start: false
    });
    job.start();
}


module.exports = {
    start : start
};