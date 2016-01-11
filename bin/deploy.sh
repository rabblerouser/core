#!/bin/bash

set -e

: "${APP_GIT_SHA:?Expecting APP_GIT_SHA to be set}"
: "${CERT_EMAIL:?Expecting CERT_EMAIL to be set}"
: "${DB_PASSWORD:?Expecting DB_PASSWORD to be set}"
: "${HOST:?Expecting HOST to be set}"

sudo yum install ansible

ansible-playbook --check --diff -i "${HOST}," provisioning/prod.yml
