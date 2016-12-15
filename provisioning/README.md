Provisioning
============

Herein lies a bunch of ansible stuff creating development and CI environments

`dev.yml` is designed to run as part of the vagrant provisioning step (see `../Vagrantfile`). It sets up everything required for development, so everyone has the same environment.

`ci.yml` sets up a [Snap CI](https://snap-ci.com) stage (or other platforms probably) for testing to ensure a consistent build environment. Designed to be called from `../bin/ci.sh`.
