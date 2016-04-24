# rabblerouser-core

[![Build Status](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master/build_image)](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master)

## Dev setup

0. Install [virtual box](https://www.virtualbox.org/)
0. Install [vagrant](https://www.vagrantup.com/downloads.html)
0. Install [ansible](https://docs.ansible.com/ansible/intro_installation.html)
0. Clone the project

        git clone https://github.com/rabblerouser/rabblerouser-core.git

0. Start the vagrant vm

        vagrant up && vagrant provision

0. Log onto the vm

        vagrant ssh

0. Find the project files

        cd /vagrant

0. Install dependencies

        npm install

0. Email configuration [Optional]

        1. Run `which sendmail` in a terminal
        2. Add EMAIL_SERVER="Path to sendmail" to environment vars
        3. Turn on the toggle `email.sendEmails` in each specific environment (config/default.json, config/staging.json, config/production.json)

0. Run the tests

        npm test

0. Start the server

        npm start

0. Re-bundling the UI

    The frontend code must be re-bundled whenever it changes; `npm start` serves the last bundled version of the UI. We have a `postinstall` task that bundles any time `npm install` is run (i.e. on deployment).

    When developing, the easiest way to keep the front-end up to date is to run the following command in a separate shell, which will watch the code and re-bundle on changes. This can be run outside of the Vagrant VM, if you have `npm` installed on your host machine.

        npm run bundle

### Tests

0. Run server side tests

        npm run serverTests

0. Run client side tests

        npm run componentTests

0. Run a specific server side test

        NODE_ENV=test node --harmony node_modules/jasmine/bin/jasmine.js spec/integration/membersSpec.js

0. Run smoke tests against an external target

        NODE_ENV=test INSTANCE_URL=http://myinstance.mydomain.com node --harmony node_modules/jasmine/bin/jasmine.js spec/integration

### Linting

We use eslint to enforce a consisten style across the project. Linting of the frontend code is already part of the build, and the backend will be soon as well. To run eslint use one of these commands:

    npm run lint-frontend
    npm run lint-backend
    npm run lint #does both

To lint just a specific file or directory:

    ./node_modules/.bin/eslint --ext js,jsx src/path/to/file

If you're not sure how to fix an eslint error, you can look up the docs for specific rules using a URL like: http://eslint.org/docs/rules/arrow-parens. In this case, `arrow-parens` is the name of the rule.

We're using the [airbnb style](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (slightly modified), which encourages use of many ES6 features. If you're not up to speed on ES6, this reference may come in handy: http://es6-features.org/.

### Utility scripts

0. Migrate the database (run automatically as part and npm start or npm test)

        ./node_modules/sequelize-cli/bin/sequelize db:migrate

0. Create a new migration

        ./node_modules/sequelize-cli/bin/sequelize migration:create --config config/db.json --name <migration_name>


0. Create an admin user to access the organiser views

        npm run createAdmin

### Pull a copy of the staging db from heroku

0. heroku pg:backups capture --app <app_name>

0. curl -o db/dumps/latest.dump `heroku pg:backups public-url`

0. (in the vm) pg_restore --verbose --clean --no-acl --no-owner -h localhost -U lab-assistant -d lab-assistant db/dumps/latest.dump

Happy hacking!

## Optional setup

### WebStorm

0. Install [webstorm](https://www.jetbrains.com/webstorm/download/)

0. Open preferences -> Languages and frameworks

0. Change javascript to ECMAScript 6

0. Setup run configuration to node and "javascript/file" to be bin/www

0. Optionally install vagrant plugin


