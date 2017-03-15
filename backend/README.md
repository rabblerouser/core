# Rabble Rouser Core Backend

Backend for Rabble Rouser - A pluggable, extensible membership database for community organising

## Read this first
Rabble Rouser has a microservice architecture, so we provide a fully [Dockerised](https://www.docker.com/) development
environment. If you have no idea what that means, that's ok, just know that before running any of the commands in this
readme, you should first have run the `./go.sh` script from the root of this repository, as described in the top-level
README for this project.

## Automated testing workflow:

1. **From the backend directory**: `npm test -- --watch`
2. Make your changes

The tests will re-run whenever you make a change.

## Manual testing workflow:

1. **From the root directory**: `npm run build`
2. **From the backend directory**: `npm run dev`
3. Make your changes
4. Point your browser at `http://localhost:3000`

The server will auto-restart whenever you make backend changes. If you change any frontend code during this process,
you'll need to `npm run build` again.
