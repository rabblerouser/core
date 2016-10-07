#!/bin/bash
set -e
echo "Will wait for the server to be available for testing..."
attempts=0
until $(curl --output /dev/null --silent --head --fail $TARGET_HOST); do
  attempts=$((attempts+1))
  if [ "$attempts" = '100' ]; then
    echo "Tried to contact the site, but it's taking too long. Possibly it's broken. Either way it's ignoring me and I don't appreciate this."
    exit 1
  fi
  sleep 5
done
echo "Oh hai server!"
npm run seed &&
npm --prefix e2e run ci-test
