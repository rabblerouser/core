# Rabble Rouser Core E2E Tests

End to end tests for Rabble Rouser - A pluggable, extensible membership database for community organising

## Tech

 * Webpack + Babel
 * Cypress

## Running the tests
Running the script at `../bin/e2e.sh` is the best way to run the tests. This will also run the prep-data task which sets up the backend with required data before kicking off the tests.
You could run `yarn ci-test` - but you'd need to ensure that there was a server running at `localhost:3000` and serving the bundle file first.

Tests live in `cypress/integration`.  See `docs.cypress.io` for more usage information.

## Linting

`yarn lint`

See the README.md in the root of the repo for more information about our lint setup.
