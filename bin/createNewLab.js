'use strict';

var Branch = require('../src/backend/models/index').Branch;
var readline = require('readline');

var rl = readline.createInterface({input: process.stdin, output: process.stdout});

rl.question('Please enter the new Lab name: ', function (name) {
    Branch.create({name: name})
    .then(function (branch) {
        console.log('Lab: "' + branch.name + '" created.');
        process.exit(0);
    }).catch(function (err) {
        console.log('Error: ' + err);
        process.exit(1);
    });
});
