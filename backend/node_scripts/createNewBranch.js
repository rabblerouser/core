'use strict';

var Branch = require('../src/models').Branch;
var readline = require('readline');

var rl = readline.createInterface({input: process.stdin, output: process.stdout});

rl.question('Please enter the new Branch name: ', function (name) {
    Branch.create({name: name})
    .then(function (branch) {
        console.log('Branch: "' + branch.name + '" created.');
        process.exit(0);
    }).catch(function (err) {
        console.log('Error: ' + err);
        process.exit(1);
    });
});
