#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
npm run build
npm run e2e
