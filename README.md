# Project-M

[![Build Status](https://snap-ci.com/ppau/project-m/branch/master/build_image)](https://snap-ci.com/ppau/project-m/branch/master)

## Dev setup

0. Install [vagrant](https://www.vagrantup.com/downloads.html)
0. Install [ansible](https://docs.ansible.com/ansible/intro_installation.html)
0. Clone the project

        git clone https://github.com/ppau/project-m.git

0. Start the vagrant vm

        vagrant up

0. Log onto the vm

        vagrant ssh

0. Find the project files

        cd /vagrant

0. Install dependencies

        npm install

0. Migrate the database

        ./node_modules/sequelize-cli/bin/sequelize db:migrate

0. Happy hacking!

## Optional setup

### WebStorm

0. Install [webstorm](https://www.jetbrains.com/webstorm/download/)

0. Open preferences -> Languages and frameworks

0. Change javascript to EXMAScript 6

0. Setup run configuration to node and "javascript/file" to be bin/www

0. Optionally install vagrant plugin
