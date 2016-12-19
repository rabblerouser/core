# rabblerouser-core

[![Build Status](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master/build_image)](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master)

Rabble Rouser core is the membership database component of the Rabble Rouser ecosystem. It provides a member sign up form and an administrative backend which allows editing of members.

To find out more about the Rabble Rouser project, check out our [documentation repo](https://github.com/rabblerouser/rabblerouser-docs).

## First-time setup

0. Install [VirtualBox](https://www.virtualbox.org/), [Vagrant](https://www.vagrantup.com/downloads.html), and [Ansible](https://docs.ansible.com/ansible/intro_installation.html)
0. Clone the project

        git clone https://github.com/rabblerouser/rabblerouser-core.git

0. Start the Vagrant VM and log into it

        cd rabblerouser-core
        vagrant up
        vagrant ssh

0. Install project dependencies and compile the frontend assets

        npm install

0. Run the tests (backend & frontend)

        npm test

0. Seed the local database and start the app

        npm run seed
        npm start

0. Run the e2e tests (With the server still running - you may need to open another tab and `vagrant ssh` again.)

        npm run e2e

0. Verify that the app works:
  0. Register a new member at `http://localhost:3000`
  0. Log in at `http://localhost:3000/login`, with `admin@rr.com`/`apassword`

Later on you can run all tests (frontend, backend, and e2e) in one go with:

        npm run precommit

For the optional email configuration step, see near the bottom of this document.

## Understanding this repository

This repository is split into these sub-directories:

 * `backend`: The backend node.js API
 * `bin`: Utility scripts, mostly for build/deploy tasks
 * `e2e`: End-to-end tests built with casperjs
 * `frontend`: The frontend React.js webapp
 * `provisioning`: Ansible scripts for environment setup (local and deployed)

The frontend, backend, and E2E tests are all written in JavaScript, so each one has a `package.json` file for
dependencies and tasks. There is also another `package.json` at the top-level of the repo, which mainly orchestrates the
tasks contained within the sub-projects.

The following sections assume that you've done the first time setup above.

## *"I want to work on the backend"*
### Automated testing workflow:

1. Make your changes
2. From the backend directory: `npm test`
3. Goto #1

### Manual testing workflow:

1. From the root directory: `npm run build && npm start`
2. Make your changes
3. Point your browser at `http://localhost:3000`
4. Goto #2

Note: Some specific files, such as the routes, may require a full restart. In this case, start from step 1 again. This is
also the case if you happen to change any frontend code during this process.

## *"I want to work on the frontend (javascript or styles)"*
### Automated testing workflow:

1. Make your changes
2. From the frontend directory: `npm test`
3. Goto #1

### Manual testing workflow:

1. `cd /vagrant/backend && npm start`
2. `cd /vagrant/frontend && npm start`
3. Make your changes
4. Point your browser at `http://localhost:8080`, and wait for the changes to hot-reload.
5. Goto #3

## Linting

We use ESLint to maintain a consistent style and detect common sources of bugs, and this is run as part of the build system. To run ESLint just do `npm run lint` in one of the frontend, backend, or e2e directories.

To lint just a specific file or directory:

    ./node_modules/.bin/eslint --ext js,jsx src/path/to/file

You can even add `--fix` to the end of that command to automatically fix things like whitespace errors.

If you're not sure how to fix an ESLint error, you can look up the docs for specific rules using a URL like: http://eslint.org/docs/rules/arrow-parens. In this case, `arrow-parens` is the name of the rule.

We're using the [airbnb style](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (slightly modified), which encourages use of many ES6 features. If you're not up to speed on ES6, this reference may come in handy: http://es6-features.org/.

## Backend utility scripts

These should all be run from the `backend` directory.

* Create a new migration

        ./node_modules/sequelize-cli/bin/sequelize migration:create --config config/db.json --name <migration_name>

## Customising the app for your organisation

At the moment, this is done using environment variables. The table below describes the use of these environment variables. At the moment, everything is optional, and a default theme will be provided if none is given.

| Variable                 | Description                                                                        | Used in           |
|--------------------------|------------------------------------------------------------------------------------|-------------------|
| `SIGNUP_TITLE`           | The title  on the signup page                                                      | frontend          |
| `SIGNUP_SUBTITLE`        | The sub-title on the signup page                                                   | frontend          |
| `SIGNUP_FINISHED_MESSAGE`| The message shown after signing up                                                 | frontend          |
| `SIGNUP_STYLESHEETS`     | Custom stylesheets URLS for the signup page. See below                             | frontend          |
| `SIGNUP_HOME_PAGE_LINK`  | A link to your organisation's home page                                            | frontend          |
| `SKIN`                   | The directory under `frontend/public/images` from where logos etc should be loaded | frontend, backend |
| `ADDRESS_ENABLED`        | If set, shows address fields in signup and admin page                              | frontend          |

* for the frontend, the variable is needed during `npm run build`, or `cd frontend && npm start`.
* for the backend, the variable is needed during `npm start` or `cd backend && npm start`.
* Stylesheets should be specified like a JSON array, e.g.:

`SIGNUP_STYLESHEETS='["/styles/signup.css", "https://example.com/custom-style.css", "https://fonts.com/my-font"]'`

## Email configuration

Rabble Rouser supports the following e-mailing tools:

### Gmail

0. Set the email.transporter setting (in default.json) to **'gmail'**

0. Create an [Application Password](https://www.google.com/settings/security/lesssecureapps) trough your Google Account (Go [here](https://security.google.com/settings/security/apppasswords) if you have 2 factor Authentication enabled)

0. Add EMAIL_USERNAME="your_email@gmail.com" EMAIL_PASSWORD="the password generated in the previous step" to environment vars

0. Turn on the toggle `email.sendEmails` in each specific environment (`config/default.json`, `config/  staging.json`, `config/production.json`)

### MailGun

0. Set the email.transporter setting (in default.json) to **'mailgun'**

0. In your [control panel](https://mailgun.com/cp) check the Default SMTP Login and Default Password for your domain.

0. Create the following env vars: EMAIL_USERNAME="Default SMTP Login" EMAIL_PASSWORD="Default Password"

0. Turn on the toggle `email.sendEmails` in each specific environment (`config/default.json`, `config/  staging.json`, `config/production.json`)
