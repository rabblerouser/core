#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install

NODE_ENV=test INSTANCE_URL=https://project-m-staging.herokuapp.com node --harmony node_modules/jasmine/bin/jasmine.js spec/integration/membersSpec.js
