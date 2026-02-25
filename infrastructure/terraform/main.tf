provider "aws" {
  region = var.aws_region
}

# 1. VPC Configuration for Sovereign Isolation
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "gys-global-sovereign-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false # High Availability
  
  tags = {
    Environment = "production"
    Protocol    = "SIP-v7.2"
  }
}

# 2. EKS Cluster (The Sovereign Core)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "gys-global-core"
  cluster_version = "1.31"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    sovereign_nodes = {
      instance_types = ["t3.large"]
      min_size     = 3
      max_size     = 10
      desired_size = 3
    }
  }

  # Karpenter Integration for Predictive Scaling
  node_security_group_additional_rules = {
    ingress_karpenter_webhook = {
      description = "Karpenter Webhook"
      protocol    = "tcp"
      from_port   = 8443
      to_port     = 8443
      type        = "ingress"
      source_cluster_security_group = true
    }
  }
}

# 3. Redis Cluster (ElastiCache) for <2s Response Latency
resource "aws_elasticache_cluster" "sovereign_cache" {
  cluster_id           = "gys-cache-v7"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.cache_subnets.name
}

resource "aws_elasticache_subnet_group" "cache_subnets" {
  name       = "gys-cache-subnets"
  subnet_ids = module.vpc.private_subnets
}
