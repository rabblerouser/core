'use strict';

const Q = require('q');
const models = require('../models');
const readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Email: ', function(email) {
    rl.question('Password: ', function(password) {
        let user = models.AdminUser.create({email: email, password: password}).then(function(user) {
            console.log('User "' + user.email + '" created.');
            process.exit(0);
        }).catch(function(err) {
            console.log('Error: ' + err);
            process.exit(1);
        });
    });
});
