# Rabble Rouser Core E2E Tests

End to end tests for Rabble Rouser - A pluggable, extensible membership database for community organising

## Tech

 * Webpack + Babel
 * Cypress

## Running the tests
Running the script `go.sh e2e` from the project root on your local machine is the best way to run the tests. This will also spin up the relevant containers and populate data.
You could run `yarn ci-test` locally - but you'd need to ensure that there was a server exposed at `localhost:3000` and serving the bundle file first.

Tests live in `cypress/integration`.  See `docs.cypress.io` for more usage information.

## Linting

`yarn lint`

See the README.md in the root of the repo for more information about our lint setup.
