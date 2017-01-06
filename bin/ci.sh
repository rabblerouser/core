#!/bin/bash
set -e

sudo apt-get -y purge python-apt-common
sudo apt-get -y purge python3-apt
sudo apt-get -y purge python3-dbus
sudo apt-get -y purge python3-gi
sudo apt-get -y purge python3-pycurl
sudo apt-get -y purge python3-software-properties
sudo apt-get -y purge software-properties-common
sudo apt-get -y purge unattended-upgrades

sudo apt-get install -y software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install -y ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
npm run build
npm test
