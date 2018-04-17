#!/bin/sh
set -e

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

docker logs -f --since=1s core_test_1
