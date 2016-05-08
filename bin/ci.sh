#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

echo '###################################'
echo '### Doing top-level npm install ###'
echo '###################################'

#TODO: We want to delete this step soon...
npm install

echo '#####################################'
echo '### Running frontend lint & tests ###'
echo '#####################################'

npm --prefix frontend run ci

cd ..

echo '####################################'
echo '### Running backend lint & tests ###'
echo '####################################'

npm --prefix backend run test

#TODO: Acceptance tests? Or are those just part of the backend tests?
