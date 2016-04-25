'use strict';

var models = require('../src/models');
var readline = require('readline');
var map = require('lodash').map;
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

function printBranches(branches) {
    branches.forEach(function(branch, i) {
        console.log(i + ': ' + branch.name);
    });
    console.log('\n');
}

function getAllBranches() {
    return models.Branch.findAll()
    .then(function(branches) {
        return map(branches, function(dbresult) {
            return {
                name: dbresult.dataValues.name,
                id: dbresult.dataValues.id
            };
        });
    });
}

function setupAdmin(branches) {
    return question('Please enter the number of the lab you want to create an organiser for: ')
    .then(function (lab) {
        return branches[lab];
    })
    .then(function(branch) {
        return question('Email: ')
        .then(function(email) {
            return {
                email: email,
                branch: branch.id
            };
        });
    })
    .then(function(admin) {
        return question('Password: ')
        .then(function(password) {
            admin.password = password;
            return admin;
        });
    })
    .then(function(admin) {
        return Object.assign({}, admin, {type: 'BRANCH'});
    });
}

getAllBranches()
.tap(printBranches)
.then(setupAdmin)
.then(function(user) {
    return models.AdminUser.create({email: user.email, password: user.password, branchId: user.branch})
    .then(function (user) {
        console.log('Admin "' + user.email + '" created.');
        process.exit(0);
    });
})
.catch(function(err) {
    console.log('Error: Could not make admin user', err);
    process.exit(1);
});
