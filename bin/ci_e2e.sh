#!/bin/bash
set -e
./bin/_ci_install.sh && npm run seed && 
(./bin/_start_server.sh & if ./bin/_run_e2e_tests.sh ; then
  echo 'Successfully completed'
  exit 0
else
  echo 'Test run failed'
  exit 1
fi)
