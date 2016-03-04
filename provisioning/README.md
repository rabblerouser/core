Provisioning
============

Herein lies a bunch of ansible stuff for all the things required for different deployments.

`dev.yml` is designed to run as part of the vagrant provisioning step (see `../Vagrantfile`). It sets up everything required for development, so everyone has the same environment.

`ci.yml` sets up a [Snap CI](https://snap-ci.com) stage (or other platforms probably) for testing to ensure a consistent build environment. Designed to be called from `../bin/ci.sh`.

`prod.yml` sets up an Ubuntu machine and deploys a version of the app. Designed to be invoked froma Snap CI stage with `../bin/deploy.sh`. Requires the following:

0. A host with a user (not root) set up with a keypair for ssh login

0. An ansible hosts file available in the app root as `hosts`:

        [all]

        some.host.com ansible_connection=ssh ansible_ssh_user=<your ssh user> ansible_ssh_private_key_file=<location_of_your_ssh_private_key>
        #The hostname should be the domain used for the webserver - the https certificate will match the hostname set here

0. A database password set up as an environment variable (on the deployment box)`DB_PASSWORD`

0. The commit of the app that should be deployed as an environment variable (on the deployment box) `APP_GIT_SHA`

0. A random string to use as session secret as an environment variable (on the deployment box) `SESSION_SECRET`
