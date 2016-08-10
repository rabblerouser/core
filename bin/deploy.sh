#!/bin/bash

set -e

: "${APP_GIT_SHA:?Expecting APP_GIT_SHA to be set}"
: "${CERT_EMAIL:?Expecting CERT_EMAIL to be set}"
: "${DB_PASSWORD:?Expecting DB_PASSWORD to be set}"

sudo yum install ansible

ansible-playbook -i hosts provisioning/prod.yml
