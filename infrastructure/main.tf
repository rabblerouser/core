provider "aws" {
  region = "${var.region}"
}

resource "aws_eip" "ip" {
  instance = "${aws_instance.web.id}"
}

resource "aws_instance" "web" {
  ami = "${var.ubuntu[var.region]}"
  instance_type = "t2.micro"
  key_name = "${aws_key_pair.ansible.key_name}"

  tags {
    Name = "Rabble Rouser Web"
  }
}

resource "aws_key_pair" "ansible" {
  key_name = "rabble_rouser_ansible_key"
  public_key = "${file(var.public_key_path)}"
}

resource "aws_db_instance" "db" {
  instance_class = "db.t2.micro"
  allocated_storage = 20
  storage_type = "gp2"
  multi_az = false

  engine = "postgres"
  engine_version = "9.5.4"

  name = "rabble_rouser"
  username = "rabble_rouser"
  password = "${var.db_password}"
  port = 5432

  // This doesn't work with db.t2.micro
  // storage_encrypted = true
}
