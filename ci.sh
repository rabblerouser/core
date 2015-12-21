#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost" provisioning/ci.yml

npm install
npm test
