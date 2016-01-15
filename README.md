# Project-M

[![Build Status](https://snap-ci.com/ppau/project-m/branch/master/build_image)](https://snap-ci.com/ppau/project-m/branch/master)

## Dev setup

0. Install [vagrant](https://www.vagrantup.com/downloads.html)
0. Install [ansible](https://docs.ansible.com/ansible/intro_installation.html)
0. Clone the project

        git clone https://github.com/ppau/project-m.git

0. Start the vagrant vm

        vagrant up && vagrant provision

0. Log onto the vm

        vagrant ssh

0. Find the project files

        cd /vagrant

0. Install dependencies

        npm install

0. Add stripe keys
        1. Visit [stripe](https://dashboard.stripe.com/test/dashboard)
        2. Click your account -> account settings
        3. Click API keys
        4. Copy the ones you wish to use into /config/stripe-config.json (for test and dev)

0. Run the tests

        npm test

0. Start the server

        npm start

### webpack

0. npm install webpack -g

0. webpack --progress --colors --watch

### Tests

0. Run server side tests

        npm run jasmineTests

0. Run client side tests

        npm run componentTests

0. Run a specific server side test

        NODE_ENV=test node --harmony node_modules/jasmine/bin/jasmine.js spec/integration/membersSpec.js

0. Run smoke tests against an external target

        NODE_ENV=test INSTANCE_URL=http://myinstance.mydomain.com node --harmony node_modules/jasmine/bin/jasmine.js spec/integration

### Utility scripts

0. Migrate the database (run automatically as part and npm start or npm test)

        ./node_modules/sequelize-cli/bin/sequelize db:migrate


Happy hacking!

## Optional setup

### WebStorm

0. Install [webstorm](https://www.jetbrains.com/webstorm/download/)

0. Open preferences -> Languages and frameworks

0. Change javascript to EXMAScript 6

0. Setup run configuration to node and "javascript/file" to be bin/www

0. Optionally install vagrant plugin
