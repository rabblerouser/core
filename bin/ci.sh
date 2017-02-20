#!/bin/sh
set -e
set -x

sudo apt-get install -y software-properties-common
sudo apt-add-repository -y ppa:ansible/ansible
sudo apt-get update
sudo apt-get install -y ansible

sudo ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
npm run build
npm test
