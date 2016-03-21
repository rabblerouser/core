'use strict';

var models = require('../src/backend/models');
var readline = require('readline');
var Q = require('q');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(text) {
    var deferred = Q.defer();

    rl.question(text, function(result) {
        deferred.resolve(result);
    });

    return deferred.promise;
}

function setupAdmin() {
    return question('Email: ')
    .then(function(email) {
        return {
            email: email
        };
    })
    .then(function(admin) {
        return question('Password: ')
        .then(function(password) {
            admin.password = password;
            return admin;
        });
    })
    .then(function(admin) {
        return Object.assign({}, admin, {type: 'SUPER'});
    });
}

setupAdmin()
.then(function(user) {
    return models.AdminUser.create({email: user.email, password: user.password, type: user.type})
    .then(function (user) {
        console.log('Super admin "' + user.email + '" created.');
        process.exit(0);
    });
})
.catch(function(err) {
    console.log('Error: Could not make admin user', err);
    process.exit(1);
});