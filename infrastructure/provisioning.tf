resource "aws_key_pair" "ansible" {
  key_name = "rabble_rouser_ansible_key"
  public_key = "${file(var.public_key_path)}"
}

resource "null_resource" "provisioner" {
  # Only do this after the DNS record has been created
  depends_on = ["aws_route53_record.domain"]

  triggers {
    # Redo this whenever a new EC2 instance is created
    instance = "${aws_instance.web.id}"
  }

  provisioner "local-exec" {
    command = "
      ANSIBLE_HOST_KEY_CHECKING=False \\
      \\
      DOMAIN='${var.domain}' \\
      CERT_EMAIL='${var.tls_cert_email}' \\
      APP_GIT_SHA='${var.app_git_sha}' \\
      SESSION_SECRET='${var.session_secret}' \\
      \\
      DB_NAME='${aws_db_instance.db.name}' \\
      DB_USER='${aws_db_instance.db.username}' \\
      DB_PASSWORD='${aws_db_instance.db.password}' \\
      DB_HOST='${aws_db_instance.db.address}' \\
      DB_PORT='${aws_db_instance.db.port}' \\
      \\
      ansible-playbook -i ${aws_eip.eip.public_ip}, -u ubuntu --private-key='${var.private_key_path}' ../provisioning/prod.yml -v
    "
  }
}
