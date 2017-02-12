# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 4567, host: 4567

  config.vm.provider "virtualbox" do |v|
    v.memory = 1512
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provisioning/dev.yml"
  end
end
