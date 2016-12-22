#!/bin/bash
set -e

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker pull rabblerouser/rabblerouser-core
docker build -t rabblerouser/rabblerouser-core backend
docker push rabblerouser/rabblerouser-core
