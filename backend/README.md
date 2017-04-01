# Rabble Rouser Core Backend

Backend for Rabble Rouser - A pluggable, extensible membership database for community organising

## Read this first
Rabble Rouser has a microservice architecture, so we provide a fully [Dockerised](https://www.docker.com/) development
environment. If you have no idea what that means, that's ok, just know that before running any of the commands in this
readme, you should first have run the `./go.sh` script from the root of this repository, as described in the top-level
README for this project.

## Automated testing workflow:

There are unit tests and integration tests. The unit tests can be run in watch mode (i.e. the tests are re-run whenever)
you make a change, but the integration tests cannot. So there are two different tasks for running them. A good workflow
is (**all from the backend directory**):

1. `npm run tdd` to run just the unit tests in watch mode
2. Make your changes and get all the unit tests to pass
3. `npm test` to run *all* tests as a one off

## Manual testing workflow:

1. **From the root directory**: `npm run build`
2. **From the backend directory**: `npm run dev`
3. Make your changes
4. Point your browser at `http://localhost:3000`

The server will auto-restart whenever you make backend changes. If you change any frontend code during this process,
you'll need to `npm run build` again.
