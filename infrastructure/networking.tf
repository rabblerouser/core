resource "aws_route53_record" "domain" {
  # Attaching a subdomain to an existing zone
  zone_id = "${var.route53_zone_id}"
  name = "${var.domain}"
  type = "A"
  ttl = "300" # seconds
  records = ["${aws_eip.eip.public_ip}"]
}

resource "aws_eip" "eip" {
  instance = "${aws_instance.web.id}"
}

resource "aws_security_group" "web" {
  name = "rabble_rouser_web"
  description = "Allow SSH and HTTP(S) in. Allow DNS, HTTP(S), and RDS out."

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 53
    to_port = 53
    protocol = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = ["${aws_security_group.rds.id}"]
  }
}

resource "aws_security_group" "rds" {
  name = "rds"
  description = "A group for RDS to live in, which allows access from the web group"
}

resource "aws_security_group_rule" "rds_ingress" {
  # This is down here to break the cyclic dependency between the web and rds security groups
  security_group_id = "${aws_security_group.rds.id}"
  type = "ingress"
  from_port = 5432
  to_port = 5432
  protocol = "tcp"
  source_security_group_id = "${aws_security_group.web.id}"
}
