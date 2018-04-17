#!/usr/bin/env bash

set -e

# This follows a different path to the other tests/shell, since the e2e script
# spins up its own containers as needed.
if [ $1 = "e2e" ]
then
  ./bin/e2e.sh
  exit
fi

# Usage examples:
# `./go.sh` to get an interactive shell in a container for development
# `./go.sh yarn test` to run the tests in a container and then exit
docker-compose up -d --remove-orphans

if [[ -z $1 ]];
then
  docker-compose exec core /bin/bash
else
  docker-compose exec core "$@"
fi
