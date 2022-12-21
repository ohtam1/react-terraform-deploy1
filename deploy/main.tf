variable "prefix" {
  default = "s3www-"
}
variable "aws_region" {
  default = "ap-northeast-3"
}
variable "author_mail" {
  default = "foo@example.com"
}

resource "random_id" "id" {
  byte_length = 8
}

locals {
  prefix = "${var.prefix}${random_id.id.hex}-"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      mail         = var.author_mail
      project_name = "${var.prefix}${random_id.id.hex}"
      provided_by  = "Terraform"
    }
  }
}
