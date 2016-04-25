#!/bin/bash
set -e

NODE_ENV=test

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
cd backend

INSTANCE_URL=https://lab-assistant-staging.herokuapp.com ./backend/node_modules/.bin/jasmine backend/spec/backend/integration/newMemberSignsUpSpec.js
