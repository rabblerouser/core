# Rabble Rouser Core

[![Build Status](https://travis-ci.org/rabblerouser/core.svg?branch=master)](https://travis-ci.org/rabblerouser/core)

Rabble Rouser core is the membership database component of the Rabble Rouser ecosystem. It provides a member sign up form
and an administrative backend which allows editing of members.

To find out more about the Rabble Rouser project, check out our [documentation repo](https://github.com/rabblerouser/rabblerouser-docs).

## First-time setup

1. Install Docker:
  - [for Mac](https://docs.docker.com/docker-for-mac/)
  - [for Windows](https://docs.docker.com/docker-for-windows/)
  - [for Linux](https://docs.docker.com/engine/installation/linux/)

2. Clone the project:

        git clone https://github.com/rabblerouser/core.git

3. Start a Docker container to develop in (this also starts containers for dependent services):

        ./go.sh # For Mac/Linux
        # Windows not supported yet :(

4. Install/compile the project, seed the database, run the tests, then start the app

        npm install
        npm run seed
        npm test
        npm start

5. Verify that the app works:
  1. Register a new member at `http://localhost:3000`
  2. Log in at `http://localhost:3000/login`, with `superadmin@rabblerouser.team`/`password1234`

## Bonus commands

To run a single command inside the container, rather than interactive mode:
```sh
./go.sh npm test
```

To watch container logs (e.g. for debugging):
```sh
# This will show all container logs, colour-coded
docker-compose logs -f

#This will show just the event-forwarder container's logs
docker-compose logs -f event-forwarder
```

To restart all containers with a clean slate:
```sh
docker-compose stop
docker-compose rm
```

To pull new versions of the docker images (e.g. kinesis, event-forwarder, etc):
```
docker-compose pull
```

If you get sick of typing docker-compose, you might want to add an alias to your `.bashrc` file
```sh
alias doco=docker-compose
```

## Understanding this repository

This repository is split into these sub-directories:

 * `bin`: Utility scripts, mostly for build/deploy tasks
 * `frontend`: The frontend React.js web app
 * `backend`: The backend node.js API
 * `e2e`: End-to-end tests built with casperjs (broken right now, ignore them)

The frontend, backend, and E2E tests are all written in JavaScript, so each one has a `package.json` file for
dependencies and tasks. There is also another `package.json` at the top-level of the repo, which mainly orchestrates the
tasks contained within the sub-projects.

Each of these directories also has its own README file, with more instructions for how to work on its code.

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
