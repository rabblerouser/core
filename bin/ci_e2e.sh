#!/bin/bash
set -e

sudo apt-get install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
npm run build
npm run e2e
