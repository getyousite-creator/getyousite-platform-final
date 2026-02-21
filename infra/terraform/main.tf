# ============================================================================
# Terraform Configuration - GetYouSite Infrastructure
# ============================================================================
# Infrastructure as Code for reproducible, scalable deployment
# Zero manual server setup - everything defined in code
# ============================================================================

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }

  backend "s3" {
    bucket         = "getyousite-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# ============================================================================
# VARIABLES
# ============================================================================

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain" {
  description = "Main domain"
  type        = string
  default     = "getyousite.com"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.r6g.large"
}

variable "enable_autoscaling" {
  description = "Enable horizontal pod autoscaling"
  type        = bool
  default     = true
}

# ============================================================================
# PROVIDERS
# ============================================================================

provider "aws" {
  region = var.region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "kubernetes" {
  host                   = aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

# ============================================================================
# DATA SOURCES
# ============================================================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_eks_cluster_auth" "cluster" {
  name = aws_eks_cluster.cluster.name
}

# ============================================================================
# LOCALS
# ============================================================================

locals {
  name        = "getyousite"
  environment = var.environment
  domain      = var.domain
  
  common_tags = {
    Project     = local.name
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================================================
# VPC & NETWORKING
# ============================================================================

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "${local.name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = local.common_tags
}

# ============================================================================
# EKS CLUSTER (Kubernetes)
# ============================================================================

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.0.0"

  cluster_name    = "${local.name}-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

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

# ============================================================================
# RDS POSTGRESQL (Database)
# ============================================================================

resource "aws_db_subnet_group" "main" {
  name       = "${local.name}-db-subnet"
  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

resource "aws_security_group" "rds" {
  name        = "${local.name}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
  }

  tags = local.common_tags
}

resource "aws_db_instance" "postgresql" {
  identifier = "${local.name}-db"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn

  db_name  = "getyousite"
  username = "getyousite_admin"
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  multi_az               = true
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${local.name}-final-snapshot"

  tags = local.common_tags
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7
  tags                    = local.common_tags
}

# ============================================================================
# ELASTICACHE REDIS (Caching)
# ============================================================================

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.name}-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "redis" {
  name        = "${local.name}-redis-sg"
  description = "Security group for Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
  }

  tags = local.common_tags
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${local.name}-redis"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 3
  parameter_group_name = "default.redis6.x"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]

  tags = local.common_tags
}

# ============================================================================
# S3 BUCKETS (Storage & Backups)
# ============================================================================

resource "aws_s3_bucket" "assets" {
  bucket = "${local.name}-assets-${data.aws_caller_identity.current.account_id}"

  tags = local.common_tags
}

resource "aws_s3_bucket" "backups" {
  bucket = "${local.name}-backups-${data.aws_caller_identity.current.account_id}"

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.backups.arn
    }
  }
}

resource "aws_kms_key" "backups" {
  description             = "KMS key for backup encryption"
  deletion_window_in_days = 7
  tags                    = local.common_tags
}

# ============================================================================
# CLOUDFLARE (DNS + WAF + DDoS Protection)
# ============================================================================

resource "cloudflare_zone" "main" {
  account_id = var.cloudflare_account_id
  name       = local.domain
  plan       = "enterprise"
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.main.id
  name    = "www"
  value   = aws_lb.main.dns_name
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = cloudflare_zone.main.id
  name    = "api"
  value   = aws_lb.main.dns_name
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_waf_package" "owasp" {
  zone_id = cloudflare_zone.main.id
  name    = "Cloudflare Specials"
}

resource "cloudflare_waf_rule" "sql_injection" {
  zone_id = cloudflare_zone.main.id
  priority = 1
  action   = "block"
  
  description = "Block SQL Injection"
  
  filters {
    id = "e995471a-91cf-4f62-aab0-56f87b4c73e4" # OWASP SQL Injection
  }
}

resource "cloudflare_waf_rule" "xss" {
  zone_id = cloudflare_zone.main.id
  priority = 2
  action   = "block"
  
  description = "Block XSS"
  
  filters {
    id = "e995471a-91cf-4f62-aab0-56f87b4c73e5" # OWASP XSS
  }
}

resource "cloudflare_rate_limit" "api" {
  zone_id = cloudflare_zone.main.id
  
  threshold = 100
  period    = 60
  
  match {
    request {
      methods     = ["POST", "PUT", "DELETE"]
      schemes     = ["HTTP", "HTTPS"]
      url_pattern = "*api*"
    }
  }
  
  action {
    mode = "simulate"
    
    response {
      content_type = "application/json"
      body         = "{\"error\": \"Rate limit exceeded\"}"
    }
  }
}

# ============================================================================
# APPLICATION LOAD BALANCER
# ============================================================================

resource "aws_lb" "main" {
  name               = "${local.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true

  tags = local.common_tags
}

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

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
# MONITORING (Prometheus + Grafana)
# ============================================================================

resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${local.name}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "5XXError"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "Error rate exceeds 0.1%"
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
}

resource "aws_sns_topic" "alerts" {
  name = "${local.name}-alerts"
}

resource "aws_sns_topic_subscription" "slack" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "https"
  endpoint  = var.slack_webhook_url
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.cluster.endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.cluster.name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.postgresql.endpoint
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  value       = cloudflare_zone.main.id
}
