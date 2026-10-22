#!/usr/bin/env bash
# Creates or updates the AWS infrastructure (aws/cloudformation.yml).
# Run from your machine with an admin-capable AWS profile. Needed once, and
# again only when the template changes. See docs/deploy-aws.md.
#
#   CERTIFICATE_ARN="arn:aws:acm:us-east-1:123456789012:certificate/..." \
#   GITHUB_REPOSITORY="your-org/visa2grow-web" \
#   scripts/aws/deploy-infra.sh
set -euo pipefail

STACK_NAME="${STACK_NAME:-visa2grow-site}"
export AWS_REGION=us-east-1

node scripts/aws/render-cloudformation.mjs --check

aws cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --template-file aws/cloudformation.yml \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    "DomainNames=${DOMAIN_NAMES-www.visa2grow.com}" \
    "CanonicalHost=${CANONICAL_HOST-www.visa2grow.com}" \
    "CertificateArn=${CERTIFICATE_ARN:-}" \
    "GitHubRepository=${GITHUB_REPOSITORY:-}" \
    "GitHubBranch=${GITHUB_BRANCH:-main}" \
    "CreateGitHubOidcProvider=${CREATE_GITHUB_OIDC_PROVIDER:-true}" \
    "EnableWafRateLimit=${ENABLE_WAF:-false}" \
    "InquiryNotificationEmail=${INQUIRY_NOTIFICATION_EMAIL:-sales@visa2grow.com}" \
    "InquiryFromEmail=${INQUIRY_FROM_EMAIL:-Visa2Grow Website <inquiries@visa2grow.com>}"

aws cloudformation describe-stacks --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[].[OutputKey,OutputValue]' --output table
