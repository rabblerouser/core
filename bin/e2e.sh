#!/bin/bash
set -e
set -x

export NODE_ENV=test

npm start &

echo "Will wait for the server to be available for testing..."
attempts=0
until $(curl --output /dev/null --silent --head --fail http://localhost:3000); do
  attempts=$((attempts+1))
  if [ "$attempts" = '100' ]; then
    echo "Tried to contact the site, but it's taking too long. Possibly it's broken. Either way it's ignoring me and I don't appreciate this."
    exit 1
  fi
  sleep 5
done
echo "Oh hai server!"

npm --prefix backend run e2e-seed && npm --prefix e2e run ci-test
