#!/bin/sh
set -e
set -x

./go.sh npm install
./go.sh npm run build
./go.sh npm test
