#!/bin/bash
set -e

sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install -y ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
npm run build
npm test
