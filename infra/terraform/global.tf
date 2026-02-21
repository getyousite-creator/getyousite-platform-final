# ============================================================================
# Digital Fortress Protocol - Multi-Region Infrastructure
# ============================================================================
# Global VPC with Multi-Region deployment
# VPC Peering + AWS Global Accelerator
# Self-healing infrastructure with Chaos Engineering ready
# ============================================================================

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  backend "s3" {
    bucket         = "getyousite-terraform-state"
    key            = "global/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks-global"
  }
}

# ============================================================================
# VARIABLES
# ============================================================================

variable "regions" {
  description = "List of AWS regions for multi-region deployment"
  type        = list(string)
  default     = ["us-east-1", "eu-west-1"]
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain" {
  description = "Main domain"
  type        = string
  default     = "getyousite.com"
}

# ============================================================================
# PROVIDERS
# ============================================================================

provider "aws" {
  alias  = "primary"
  region = "us-east-1"
}

provider "aws" {
  alias  = "secondary"
  region = "eu-west-1"
}

# ============================================================================
# LOCALS
# ============================================================================

locals {
  name        = "getyousite"
  environment = var.environment
  domain      = var.domain
  
  primary_region   = var.regions[0]
  secondary_region = var.regions[1]
  
  common_tags = {
    Project     = local.name
    Environment = local.environment
    ManagedBy   = "Terraform"
    MultiRegion = "true"
  }
}

# ============================================================================
# PRIMARY REGION (us-east-1)
# ============================================================================

module "primary_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  providers = {
    aws = aws.primary
  }

  name = "${local.name}-primary-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${local.primary_region}a", "${local.primary_region}b", "${local.primary_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.common_tags
}

module "primary_eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.0.0"

  providers = {
    aws = aws.primary
  }

  cluster_name    = "${local.name}-primary-cluster"
  cluster_version = "1.28"

  vpc_id     = module.primary_vpc.vpc_id
  subnet_ids = module.primary_vpc.private_subnets

  # Karpenter for intelligent auto-scaling
  enable_irsa = true
  
  eks_managed_node_groups = {
    primary = {
      min_size     = 2
      max_size     = 10
      desired_size = 3

      instance_types = ["m6i.large", "m6i.xlarge"]
      capacity_type  = "ON_DEMAND"

      tags = local.common_tags
    }
  }

  tags = local.common_tags
}

module "primary_rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.0.0"

  providers = {
    aws = aws.primary
  }

  identifier = "${local.name}-primary-db"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r6g.large"

  allocated_storage     = 100
  max_allocated_storage = 1000
  
  # Multi-AZ for high availability
  multi_az               = true
  db_subnet_group_name   = module.primary_vpc.database_subnet_group_name
  vpc_security_group_ids = [module.primary_vpc.default_security_group_id]

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  
  tags = local.common_tags
}

# ============================================================================
# SECONDARY REGION (eu-west-1)
# ============================================================================

module "secondary_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  providers = {
    aws = aws.secondary
  }

  name = "${local.name}-secondary-vpc"
  cidr = "10.1.0.0/16"

  azs             = ["${local.secondary_region}a", "${local.secondary_region}b", "${local.secondary_region}c"]
  private_subnets = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  public_subnets  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.common_tags
}

module "secondary_eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.0.0"

  providers = {
    aws = aws.secondary
  }

  cluster_name    = "${local.name}-secondary-cluster"
  cluster_version = "1.28"

  vpc_id     = module.secondary_vpc.vpc_id
  subnet_ids = module.secondary_vpc.private_subnets

  enable_irsa = true
  
  eks_managed_node_groups = {
    primary = {
      min_size     = 2
      max_size     = 10
      desired_size = 3

      instance_types = ["m6i.large", "m6i.xlarge"]
      capacity_type  = "ON_DEMAND"

      tags = local.common_tags
    }
  }

  tags = local.common_tags
}

module "secondary_rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.0.0"

  providers = {
    aws = aws.secondary
  }

  identifier = "${local.name}-secondary-db"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r6g.large"

  allocated_storage     = 100
  max_allocated_storage = 1000
  
  multi_az               = true
  db_subnet_group_name   = module.secondary_vpc.database_subnet_group_name
  vpc_security_group_ids = [module.secondary_vpc.default_security_group_id]

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  
  tags = local.common_tags
}

# ============================================================================
# VPC PEERING
# ============================================================================

resource "aws_vpc_peering_connection" "main" {
  provider = aws.primary

  vpc_id      = module.primary_vpc.vpc_id
  peer_vpc_id = module.secondary_vpc.vpc_id
  peer_region = local.secondary_region

  auto_accept = false

  tags = merge(local.common_tags, {
    Name = "${local.name}-vpc-peering"
  })
}

resource "aws_vpc_peering_connection_accepter" "secondary" {
  provider = aws.secondary

  vpc_peering_connection_id = aws_vpc_peering_connection.main.id
  auto_accept               = true

  tags = merge(local.common_tags, {
    Name = "${local.name}-vpc-peering-accepter"
  })
}

# Route tables for peering
resource "aws_route" "primary_to_secondary" {
  provider = aws.primary

  route_table_id            = module.primary_vpc.private_route_table_ids[0]
  destination_cidr_block    = module.secondary_vpc.vpc_cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.main.id
}

resource "aws_route" "secondary_to_primary" {
  provider = aws.secondary

  route_table_id            = module.secondary_vpc.private_route_table_ids[0]
  destination_cidr_block    = module.primary_vpc.vpc_cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.main.id
}

# ============================================================================
# AWS GLOBAL ACCELERATOR
# ============================================================================

resource "aws_globalaccelerator_accelerator" "main" {
  provider = aws.primary

  name            = "${local.name}-global-accelerator"
  ip_address_type = "IPV4"
  enabled         = true

  attributes {
    flow_logs_enabled   = true
    flow_logs_s3_bucket = aws_s3_bucket.flow_logs.id
    flow_logs_s3_prefix = "flow-logs"

    cross_border_enabled = true
  }

  tags = local.common_tags
}

resource "aws_globalaccelerator_listener" "main" {
  provider = aws.primary

  accelerator_arn = aws_globalaccelerator_accelerator.main.id
  protocol        = "TCP"

  port_range {
    from_port = 443
    to_port   = 443
  }

  port_range {
    from_port = 80
    to_port   = 80
  }
}

resource "aws_globalaccelerator_endpoint_group" "primary" {
  provider = aws.primary

  listener_arn = aws_globalaccelerator_listener.main.id
  endpoint_group_region = local.primary_region

  endpoint_configuration {
    endpoint_id = aws_lb.primary.arn
    weight      = 60
  }

  traffic_dial_percentage = 100
}

resource "aws_globalaccelerator_endpoint_group" "secondary" {
  provider = aws.primary

  listener_arn = aws_globalaccelerator_listener.main.id
  endpoint_group_region = local.secondary_region

  endpoint_configuration {
    endpoint_id = aws_lb.secondary.arn
    weight      = 40
  }

  traffic_dial_percentage = 100
}

# ============================================================================
# LOAD BALANCERS (Both Regions)
# ============================================================================

resource "aws_lb" "primary" {
  provider = aws.primary

  name               = "${local.name}-primary-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_primary.id]
  subnets            = module.primary_vpc.public_subnets

  enable_deletion_protection = true
  enable_http2              = true

  tags = local.common_tags
}

resource "aws_lb" "secondary" {
  provider = aws.secondary

  name               = "${local.name}-secondary-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_secondary.id]
  subnets            = module.secondary_vpc.public_subnets

  enable_deletion_protection = true
  enable_http2              = true

  tags = local.common_tags
}

resource "aws_security_group" "alb_primary" {
  provider = aws.primary

  name        = "${local.name}-primary-alb-sg"
  description = "Security group for primary ALB"
  vpc_id      = module.primary_vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_security_group" "alb_secondary" {
  provider = aws.secondary

  name        = "${local.name}-secondary-alb-sg"
  description = "Security group for secondary ALB"
  vpc_id      = module.secondary_vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# ============================================================================
# S3 FOR FLOW LOGS
# ============================================================================

resource "aws_s3_bucket" "flow_logs" {
  provider = aws.primary

  bucket = "${local.name}-flow-logs-${data.aws_caller_identity.primary.account_id}"

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "flow_logs" {
  provider = aws.primary

  bucket = aws_s3_bucket.flow_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ============================================================================
# DATA SOURCES
# ============================================================================

data "aws_caller_identity" "primary" {
  provider = aws.primary
}

data "aws_caller_identity" "secondary" {
  provider = aws.secondary
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "global_accelerator_dns_name" {
  description = "AWS Global Accelerator DNS name"
  value       = aws_globalaccelerator_accelerator.main.dns_name
}

output "primary_cluster_endpoint" {
  description = "Primary EKS cluster endpoint"
  value       = module.primary_eks.cluster_endpoint
}

output "secondary_cluster_endpoint" {
  description = "Secondary EKS cluster endpoint"
  value       = module.secondary_eks.cluster_endpoint
}

output "primary_rds_endpoint" {
  description = "Primary RDS endpoint"
  value       = module.primary_rds.endpoint
}

output "secondary_rds_endpoint" {
  description = "Secondary RDS endpoint"
  value       = module.secondary_rds.endpoint
}

output "vpc_peering_id" {
  description = "VPC Peering connection ID"
  value       = aws_vpc_peering_connection.main.id
}
