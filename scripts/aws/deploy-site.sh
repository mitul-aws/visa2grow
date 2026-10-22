#!/usr/bin/env bash
# Uploads the built site (dist/) to S3, updates the inquiry Lambda
# (dist-lambda/) and invalidates CloudFront. Used by the GitHub Actions
# pipeline; also runnable locally with AWS credentials:
#
#   AWS_REGION=us-east-1 STACK_NAME=visa2grow-site scripts/aws/deploy-site.sh
#
# Bucket, distribution and function names are read from the CloudFormation
# stack outputs, so nothing is hard-coded here.
set -euo pipefail

STACK_NAME="${STACK_NAME:-visa2grow-site}"
export AWS_REGION="${AWS_REGION:-us-east-1}"

test -f dist/index.html || { echo "dist/ is missing; run npm run build first" >&2; exit 1; }
test -f dist-lambda/index.mjs || { echo "dist-lambda/ is missing; run npm run build:lambda first" >&2; exit 1; }

output() {
  aws cloudformation describe-stacks --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET="$(output BucketName)"
DISTRIBUTION_ID="$(output DistributionId)"
FUNCTION_NAME="$(output InquiryFunctionName)"
echo "Stack $STACK_NAME -> bucket=$BUCKET distribution=$DISTRIBUTION_ID function=$FUNCTION_NAME"

# 1) Lambda first, so the API is ready before new pages that use it go live.
rm -f lambda.zip
(cd dist-lambda && zip -qr ../lambda.zip .)
aws lambda update-function-code --function-name "$FUNCTION_NAME" --zip-file fileb://lambda.zip --output text --query 'LastUpdateStatus' >/dev/null
aws lambda wait function-updated-v2 --function-name "$FUNCTION_NAME"
echo "Lambda updated"

# 2) Fingerprinted assets: cache for a year. Never deleted, so visitors still on
#    an older page can lazy-load its chunks after a deploy.
aws s3 sync dist/assets "s3://$BUCKET/assets" \
  --cache-control "public, max-age=31536000, immutable" --only-show-errors

# 3) Everything else (HTML, sitemap, images, icons): browsers revalidate on each
#    visit; CloudFront keeps a copy until the invalidation below.
aws s3 sync dist "s3://$BUCKET" --exclude "assets/*" --exclude "_headers" --delete \
  --cache-control "public, max-age=0, s-maxage=31536000, must-revalidate" --only-show-errors
aws s3 cp dist/site.webmanifest "s3://$BUCKET/site.webmanifest" \
  --content-type "application/manifest+json" \
  --cache-control "public, max-age=0, s-maxage=31536000, must-revalidate" --only-show-errors
echo "S3 synced"

# 4) Clear CloudFront's copies of the previous HTML. "/*" counts as one path.
INVALIDATION_ID="$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths '/*' --query 'Invalidation.Id' --output text)"
aws cloudfront wait invalidation-completed --distribution-id "$DISTRIBUTION_ID" --id "$INVALIDATION_ID"
echo "CloudFront invalidated ($INVALIDATION_ID)"
