#!/bin/bash

set -e

: "${APP_GIT_SHA:?Expecting APP_GIT_SHA to be set}"
: "${CERT_EMAIL:?Expecting CERT_EMAIL to be set}"
: "${DB_PASSWORD:?Expecting DB_PASSWORD to be set}"
: "${STAGING_URL:?Expecting STAGING_URL to be set}"
: "${SSH_KEY_PATH:?Expecting SSH_KEY_PATH to be set}"

sudo yum install ansible
# sudo apt-get install software-properties-common -y
# sudo apt-add-repository ppa:ansible/ansible -y
# sudo apt-get update
# sudo apt-get install ansible -y

ansible-playbook -i "${STAGING_URL}," --private-key="${SSH_KEY_PATH}" -u ubuntu provisioning/prod.yml -vvvv
