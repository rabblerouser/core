# rabblerouser-core

[![Build Status](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master/build_image)](https://snap-ci.com/rabblerouser/rabblerouser-core/branch/master)

Rabble Rouser core is the membership database component of the Rabble Rouser ecosystem. It provides a member sign up form
and an administrative backend which allows editing of members.

To find out more about the Rabble Rouser project, check out our [documentation repo](https://github.com/rabblerouser/rabblerouser-docs).

## First-time setup

1. Install [VirtualBox](https://www.virtualbox.org/), [Vagrant](https://www.vagrantup.com/downloads.html), and
[Ansible](https://docs.ansible.com/ansible/intro_installation.html)
2. Clone the project

        git clone https://github.com/rabblerouser/rabblerouser-core.git

3. Start the Vagrant VM and log into it

        cd rabblerouser-core
        vagrant up
        vagrant ssh

4. Install/compile the project, run the tests, then start the app

        npm install
        npm test
        npm start

5. Verify that the app works:
  1. Register a new member at `http://localhost:3000`
  2. Log in at `http://localhost:3000/login`, with `networkadmin@rabblerouser.team`/`password`

For the optional email configuration step, see near the bottom of this document.

## Understanding this repository

This repository is split into these sub-directories:

 * `bin`: Utility scripts, mostly for build/deploy tasks
 * `frontend`: The frontend React.js web app
 * `backend`: The backend node.js API
 * `e2e`: End-to-end tests built with casperjs (broken right now, ignore them)
 * `provisioning`: Ansible scripts for setting up a dev or CI environment

The frontend, backend, and E2E tests are all written in JavaScript, so each one has a `package.json` file for
dependencies and tasks. There is also another `package.json` at the top-level of the repo, which mainly orchestrates the
tasks contained within the sub-projects.

Each of these directories also has its own README file, with more instructions for how to work on its code, or configure
extra features (e.g. sending emails).

## Linting

We use ESLint to maintain a consistent style and detect common sources of bugs, and this is run as part of the build
system. To run ESLint just do `npm run lint` in one of the frontend, backend, or e2e directories.

To lint just a specific file or directory:

    ./node_modules/.bin/eslint --ext js,jsx src/path/to/file

You can even add `--fix` to the end of that command to automatically fix things like whitespace errors.

If you're not sure how to fix an ESLint error, you can look up the docs for specific rules using a URL like:
http://eslint.org/docs/rules/arrow-parens. In this case, `arrow-parens` is the name of the rule.

We're using the [airbnb style](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (slightly
modified), which encourages use of many ES6 features. If you're not up to speed on ES6, this reference may come in
handy: http://es6-features.org/.
