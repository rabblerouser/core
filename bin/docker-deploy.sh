#!/bin/bash
set -e
set -x

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker build -t rabblerouser/rabblerouser-core .
docker push rabblerouser/rabblerouser-core
