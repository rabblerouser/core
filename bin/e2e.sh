#!/bin/sh
set -e

docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d

docker logs -f --since=1m core_test_1
docker logs -f --since=1m core_core_1
docker logs -f --since=1m core_kinesis_1
