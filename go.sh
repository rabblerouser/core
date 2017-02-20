#!/bin/bash

# Usage examples:
# `./go.sh` to get an interactive shell in a container for development
# `./go.sh npm test` to run the tests in a container and then exit

docker-compose up -d --remove-orphans

if [[ -z $1 ]];
then
  docker-compose exec core /bin/sh
else
  docker-compose exec core "$@"
fi
