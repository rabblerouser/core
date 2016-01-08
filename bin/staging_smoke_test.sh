#!/bin/bash
set -e

sudo yum install ansible

ansible-playbook -i "localhost," -c local provisioning/ci.yml

npm install
node_modules/sequelize-cli/bin/sequelize db:migrate # even though we don't use it, the app still needs it to wake up. we can fix this later.

NODE_ENV=test INSTANCE_URL=https://project-m-staging.herokuapp.com node --harmony node_modules/jasmine/bin/jasmine.js spec/integration/membersSpec.js
