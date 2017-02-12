#!/bin/bash

# Usage examples:
# `./go.sh` to get an interactive shell in a container for development
# `./go.sh npm test` to run the tests in a container and then exit

DOCKER_COMPOSE_RUN="docker-compose run -w /app --service-ports -e NODE_ENV=development rabblerouser-core"

if [[ -z $1 ]];
then
  ${DOCKER_COMPOSE_RUN} /bin/sh --rm
else
  ${DOCKER_COMPOSE_RUN} "$@" --rm
fi
