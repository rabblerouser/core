# rabblerouser-core

[![Build Status](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master/build_image)](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master)

Rabble Rouser core is the membership database component of the Rabble Rouser ecosystem. It provides a member sign up form and an administrative backend which allows editing of members.

To find out more about the Rabble Rouser project, check out our [documentation repo](https://github.com/rabblerouser/rabblerouser-docs).

## First-time setup

0. Install [VirtualBox](https://www.virtualbox.org/)
0. Install [Vagrant](https://www.vagrantup.com/downloads.html)
0. Install [Ansible](https://docs.ansible.com/ansible/intro_installation.html)
0. Clone the project

        git clone https://github.com/rabblerouser/rabblerouser-core.git

0. Go to the project's folder

        cd rabblerouser-core

0. Start the Vagrant VM

        vagrant up && vagrant provision

0. Log onto the VM

        vagrant ssh

0. Find the project files

        cd /vagrant

0. Install dependencies

        npm install

0. Clear and seed the local database for dev and e2e testing

        npm run seed

0. Run the tests

        npm test

0. Run the e2e tests

        npm run e2e

0. Start the server

        npm start

0. Precommit - runs tests and e2e

        npm run precommit

0. Verify that the app works - Point your browser at http://localhost:3000

0. Email configuration [Optional]

    0. Run `which sendmail` in a terminal
    0. Add EMAIL_SERVER="Path to sendmail" to environment vars
    0. Turn on the toggle `email.sendEmails` in each specific environment (`config/default.json`, `config/  staging.json`, `config/production.json`)

## To sign in as an administrator

0. Create an administrator by running the creation task in your dev environment:

    `cd backend && npm run dev:createSuperAdmin`

0. Follow the script's instructions to setup create an admin user

0. Go to [http://localhost:3000/dashboard/admin](http://localhost:3000/dashboard/admin)

0. Sign in with the credentials you just created

## Understanding this repository

This repository is split into the following directories:

 * `backend`: The backend node.js API
 * `bin`: Utility scripts, mostly for build/deploy tasks
 * `e2e`: End-to-end tests built with casperjs
 * `frontend`: The frontend React.js webapp
 * `provisioning`: Ansible scripts for environment setup (local and deployed)

Because the frontend, backend, and E2E tests are all written in JavaScript, each one has its own `package.json` file for
dependencies and tasks. There is also another `package.json` at the top-level of the repo, which simply orchestrates the
tasks contained within the sub-projects.

The following sections assume that you've done the first time setup above.

### I want to work on the backend
**Automated testing workflow:**

1. Make your changes
2. From the backend directory: `npm test`
3. Goto #1

**Manual testing workflow:**

1. From the root directory: `npm run build && npm start`
2. Make your changes
3. Point your browser at `http://localhost:3000`
4. Goto #2

Note: If you happen to change frontend code during this process, you'll need to do `npm run build` from the root again.

### I want to work on the frontend (javascript or styles)
**Automated testing workflow:**

1. Make your changes
2. From the frontend directory: `npm test`
3. Goto #1

**Manual testing workflow:**

1. From the backend directory: `npm start`
2. From the frontend directory: `npm start`
3. Make your changes
4. Point your browser at `http://localhost:8080`
5. Goto #3

### Linting

We use ESLint to enforce a consistent style across the project. Linting of the frontend code is already part of the build, and the backend will be soon as well. To run ESLint just do `npm run lint` in one of the frontend, backend, or e2e directories.

To lint just a specific file or directory:

    ./node_modules/.bin/eslint --ext js,jsx src/path/to/file

If you're not sure how to fix an ESLint error, you can look up the docs for specific rules using a URL like: http://eslint.org/docs/rules/arrow-parens. In this case, `arrow-parens` is the name of the rule.

We're using the [airbnb style](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (slightly modified), which encourages use of many ES6 features. If you're not up to speed on ES6, this reference may come in handy: http://es6-features.org/.

### Utility scripts

0. Migrate the database (run automatically as part and npm start or npm test)

        ./node_modules/sequelize-cli/bin/sequelize db:migrate

0. Create a new migration

        ./node_modules/sequelize-cli/bin/sequelize migration:create --config config/db.json --name <migration_name>


0. Create an admin user to access the organiser views

        npm run createSuperAdmin

### Change the skin

The skins live in the `frontend/skins` directory. There's a default skin with a Rabble Rouser theme, and you can add your own by creating another directory. Look inside the default skin directory to see the directory structure you need. This might change over time.

You can change which skin is being used:

0. Change this setting in `frontend/package.json`:

        "config": {
          "skin": "default"
        }

0. `cd frontend`

0. `npm run set-skin` to propagate the settings into the frontend

0. `cd ..`

0. `npm run build` to have the backend use them

### Pull a copy of the staging database from Heroku

0. heroku pg:backups capture --app <app_name>

0. curl -o db/dumps/latest.dump `heroku pg:backups public-url`

0. (in the VM) pg_restore --verbose --clean --no-acl --no-owner -h localhost -U lab-assistant -d lab-assistant db/dumps/latest.dump

Happy hacking!
