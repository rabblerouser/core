'use strict';

var models = require('../models');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var email = process.env.ACCEPTANCE_EMAIL;
var password = process.env.ACCEPTANCE_PASSWORD;

if(email && password) {
    models.AdminUser.create({email: email, password: password}).then(function(user) {
        console.log('User "' + user.email + '" created.');
        process.exit(0);
    }).catch(function(err) {
        console.log('Error: Could not make admin user');
        process.exit(0);
    });
} else {
    rl.question('Email: ', function (email) {
        rl.question('Password: ', function (password) {
            models.AdminUser.create({email: email, password: password}).then(function (user) {
                console.log('User "' + user.email + '" created.');
                process.exit(0);
            }).catch(function (err) {
                console.log('Error: ' + err);
                process.exit(1);
            });
        });
    });
}
