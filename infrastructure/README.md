# rabblerouser-infrastructure

Code for spinning up the infrastructure that a Rabble Rouser instance needs.

## First-time setup
1. [Install Terraform](https://www.terraform.io/intro/getting-started/install.html)
2. [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
3. [Create an AWS account](https://aws.amazon.com/)
4. [Create an AWS API key pair](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
5. Put your credentials in `~/.aws/credentials` like this:

    ```
    [default]
    aws_access_key_id=AKIAEXAMPLEEXAMPLE
    aws_secret_access_key=abc123abc123abc123+abc123abc123
    ```

6. Create an S3 bucket to store the [terraform state file](https://www.terraform.io/docs/state/) in (see notes below):

    ```
    aws s3api create-bucket --bucket my-rabblerouser-tf-state --region us-east-1 --acl private
    ```

5. Configure terraform to use the bucket:

    ```
    terraform remote config \
      -backend=s3 \
      -backend-config="bucket=my-rabblerouser-tf-state" \
      -backend-config="key=terraform.tfstate" \
      -backend-config="region=us-east-1"
    ```

This will create a local file `.terraform/terraform.tfstate`, to remember where your state is stored. You can ignore
this file, and if you lose it, you can regenerate it with the above command.

Notes on the S3 bucket:
 - The bucket name must be unique to the whole world (not just your AWS account)
 - Terraform will store all of its state in the bucket, some of which is sensitive, so don't share access with anyone who doesn't need it
 - Terraform won't manage the bucket itself - it's the one thing you need to create and manage manually

## Create all your infrastructure

1. Create a file `terraform.tfvars` to store your secrets in locally, with the following contents (You can omit the
second line if you would like to use the public key at `~/.ssh/id_rsa.pub` for provisioning):

    ```
    // Never check this file in to source control!
    db_password = "<replace me with something secure!>"
    public_key_path = "/path/to/key.pub"
    ```

2. Do a dry run first to see what terraform will do:

    ```
    terraform plan
    ```

3. Create the infrastructure: *Warning: this may cost you money. Infrastructure isn't free :)*

    ```
    terraform apply
    ```

## Destroy all your infrastructure

Warning: this... well it will destroy all your infrastructure!

    ```
    terraform destroy
    ```
