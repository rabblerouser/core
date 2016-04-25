#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

echo '#####################################'
echo '### Running frontend lint & tests ###'
echo '#####################################'

cd frontend
npm install
npm run ci

cd ..

echo '####################################'
echo '### Running backend lint & tests ###'
echo '####################################'

cd backend
npm install
npm run test

#TODO: Acceptance tests? Or are those just part of the backend tests?
