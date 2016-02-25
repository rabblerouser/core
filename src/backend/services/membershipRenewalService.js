'use strict';

const memberService = require('./memberService');
const moment = require('moment');
let logger = require('../lib/logger');
const CronJob = require('cron').CronJob;
const everyDayAt7_30am = '00 30 7 * * *';

function membershipsExpiringSoon() {
    const in90Days = moment().add(90, 'days').format('L');

    return memberService.findMembershipsExpiringOn(in90Days);
}

function remindMembersToRenew() {
    return membershipsExpiringSoon()
    .then(memberService.notifyExpiringMembers);
}

function start() {
    let job = new CronJob({
      cronTime: everyDayAt7_30am,
      onTick: function() {
        logger.info('[renewal-notification-job-started]');

        remindMembersToRenew()
        .then((result) => logger.info('[renewal-notification-job-finished]', `Notifications sent: ${result.length}`))
        .catch((error) => {
            logger.error('[renewal-notification-job-failed]', error.toString());
        });
      },
      start: false
    });
    job.start();
}


module.exports = {
    start : start
};