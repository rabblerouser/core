# rabblerouser-core-frontend

Frontend for rabblerouser - A pluggable, extensible membership database for community organising

## Tech

 * React
 * Webpack + Babel

## Running the tests

`npm test`

TODO: This should watch files for changes and re-run the tests. In that case we'd need a task like `npm run test-once` for running in CI.

## Linting

`npm run lint`

See the README.md in the root of the repo for more information about our lint setup.

## Running the code

`npm start`

File watching is temporarily broken, so you'll need to restart npm/webpack every time you change code at the moment. This will be fixed soon, hopefully with proper HMR (i.e. no page refreshing!).
