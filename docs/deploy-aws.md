# Deploying to AWS (S3 + CloudFront + Lambda)

```
visitor ──HTTPS──▶ CloudFront ──┬── /*      ──▶ S3 bucket (private, prerendered HTML + assets)
(www.visa2grow.com) │           │              url-rewrite function: /about → about.html, redirects
                    │           └── /api/*  ──▶ Lambda function URL (inquiry → Resend → sales@)
                    └─ security headers (HSTS, CSP, …), optional WAF rate limit
```

**Main address: `https://www.visa2grow.com`.** DNS stays at GoDaddy (where your Microsoft 365 email and Resend
records live). `www` points at CloudFront with a CNAME, and GoDaddy forwards the bare `visa2grow.com` to it.

| Piece | Where |
| --- | --- |
| Infrastructure (CloudFormation) | `aws/cloudformation.yml`, generated from `aws/cloudformation.template.yml` (`npm run aws:template`) |
| Clean-URL function | `aws/cloudfront/url-rewrite.js` (unit tested) |
| Content-Security-Policy | `aws/content-security-policy.txt` (also enforced by the e2e preview server) |
| Inquiry Lambda | `aws/lambda/inquiry.ts`, built with `npm run build:lambda` → `dist-lambda/` |
| Pipeline | `.github/workflows/deploy-aws.yml` |
| Deploy scripts | `scripts/aws/deploy-infra.sh` (one-time / on template change), `scripts/aws/deploy-site.sh` (every release) |

Everything runs in **us-east-1**: CloudFront certificates and CloudFront WAF must live there, so keeping the whole
stack in one region is simplest. Visitors in India are still served from nearby CloudFront edge locations.

## What the pipeline does

On every push to `main` (or a manual run):

1. **Verify** job: install, check the generated template is current, unit tests, build + prerender, build the
   Lambda, Playwright end-to-end tests (with the production CSP). Uploads the build as an artifact.
2. **Deploy** job (only if all tests pass; uses the `production` environment, so you can require approval):
   - assumes an AWS role through GitHub OIDC (no AWS keys in GitHub)
   - updates the inquiry Lambda code
   - syncs `dist/assets` with 1-year immutable caching (old assets are kept so open pages keep working)
   - syncs everything else with `max-age=0, s-maxage=1y` and deletes removed pages
   - invalidates CloudFront `/*` and waits for it
   - smoke tests: home and a service page return 200, an unknown page returns 404, `GET /api/inquiry` returns 405,
     and the CSP header is present

## One-time setup

You need an AWS account, the AWS CLI with an admin-capable profile, and the code in a GitHub repository.

### 1. Store the Resend API key in Parameter Store

Use a **new** key (rotate the one that was shared in chat), with Sending access for `visa2grow.com`:

```bash
aws ssm put-parameter --region us-east-1 --name /visa2grow/resend-api-key \
  --type SecureString --value 're_NEW_KEY_HERE'
```

The Lambda reads it at runtime. It is never in the code, the template, GitHub or the browser.

### 2. Request the TLS certificate (ACM, us-east-1)

Only `www` is served by CloudFront (the bare domain is forwarded by GoDaddy), so the certificate needs just that name:

```bash
aws acm request-certificate --region us-east-1 \
  --domain-name www.visa2grow.com --validation-method DNS
aws acm describe-certificate --region us-east-1 --certificate-arn <ARN> \
  --query 'Certificate.DomainValidationOptions[].ResourceRecord'
```

It prints one CNAME (name like `_abc123.www.visa2grow.com.`, value like `_xyz.acm-validations.aws.`). Add it at
GoDaddy: **DNS → Add New Record → CNAME**, Name = the part **before** `.visa2grow.com` (e.g. `_abc123.www`),
Value = the value shown. Keep this record permanently; ACM uses it to renew the certificate automatically. Then wait:

```bash
aws acm wait certificate-validated --region us-east-1 --certificate-arn <ARN>
```

### 3. Create the infrastructure

```bash
CERTIFICATE_ARN="arn:aws:acm:us-east-1:<account>:certificate/<id>" \
GITHUB_REPOSITORY="<github-owner>/<repo>" \
scripts/aws/deploy-infra.sh
```

This serves `www.visa2grow.com` and redirects any other custom host to it. To try everything on the
`*.cloudfront.net` address before the certificate is ready, run it once with `DOMAIN_NAMES=""` (and no
`CERTIFICATE_ARN`), then again with the certificate.

Options (environment variables):

| Variable | Default | Notes |
| --- | --- | --- |
| `STACK_NAME` | `visa2grow-site` | |
| `DOMAIN_NAMES` | `www.visa2grow.com` | Custom domains on the distribution. `""` = cloudfront.net only. |
| `CANONICAL_HOST` | `www.visa2grow.com` | Host every other custom domain redirects to. |
| `CREATE_GITHUB_OIDC_PROVIDER` | `true` | Set `false` if the account already has the GitHub OIDC provider. |
| `ENABLE_WAF` | `false` | `true` adds a WAF rate limit on `/api/*` (≈ US$6/month). Recommended once live. |
| `INQUIRY_NOTIFICATION_EMAIL` | `sales@visa2grow.com` | |
| `INQUIRY_FROM_EMAIL` | `Visa2Grow Website <inquiries@visa2grow.com>` | Must be on the Resend-verified domain. |

### 4. Connect GitHub

GitHub → repository → **Settings → Secrets and variables → Actions**:

- Secret `AWS_DEPLOY_ROLE_ARN` = stack output `GitHubDeployRoleArn`
- Variable `SITE_URL` = `https://www.visa2grow.com` (optional; this is the default)
- Variable `AWS_STACK_NAME` only if you changed the stack name

**Settings → Environments → New environment `production`.** Add required reviewers if you want to approve each release.

The deploy role can only write to this bucket, invalidate this distribution and update this Lambda, and only
workflows running on the `main` branch of that repository can assume it.

Push to `main` (or run the workflow manually) to deploy.

### 5. DNS at GoDaddy

Do this after the first successful deploy, once the site works on the `*.cloudfront.net` address.

> **Heads-up (checked 2026-10-22):** `visa2grow.com` currently serves a **GoDaddy Website Builder** site (three
> GoDaddy `A` records on `@`, and `www` is a CNAME to `@`). The steps below replace it with the new site. Once
> they're done, unpublish or cancel the Website Builder site in GoDaddy so it doesn't fight the forwarding.

1. **`www` → CloudFront.** GoDaddy → DNS → find the existing `www` record (today a CNAME to `@`) → Edit →
   Type `CNAME`, Name `www`, Value = stack output `DistributionDomainName` (e.g. `d1abc2def3.cloudfront.net`).
2. **Bare domain → www.** GoDaddy → your domain → **Forwarding** → Domain → forward `visa2grow.com` to
   `https://www.visa2grow.com`, type **Permanent (301)**, "Forward only" (no masking). GoDaddy replaces the
   current `@` A records with its forwarding service; don't add CloudFront A records for `@`.
3. Test after a few minutes:
   ```bash
   curl -sI https://www.visa2grow.com/ | head -1          # HTTP/2 200
   curl -sI http://visa2grow.com/ | grep -i location      # https://www.visa2grow.com/
   curl -sI https://visa2grow.com/ | grep -i location     # https://www.visa2grow.com/
   ```
   If the last one fails, GoDaddy forwarding isn't serving HTTPS for the bare domain yet (it can take a while to
   issue its certificate). Visitors typing `https://visa2grow.com` would see an error until it does. Search engines
   and links use `www`, so this only affects people who type the bare domain with `https://`.

**Leave these records alone:** `MX` (`…mail.protection.outlook.com`), the `TXT` records (`NETORGFT…`, `v=spf1 …`),
any `autodiscover` CNAME (Microsoft 365), and the Resend records `resend._domainkey`, `send`, `rsend`.

If GoDaddy's bare-domain HTTPS ever becomes a problem, move DNS to Route 53 (copy every record above first). The
stack then supports serving the bare domain directly via `DOMAIN_NAMES`/`CANONICAL_HOST`.

## Day-to-day

- **Release:** merge to `main`. The pipeline tests and deploys, usually in 5–8 minutes.
- **Roll back:** re-run the workflow for an earlier commit (Actions → Deploy to AWS → run on that commit), or revert
  the commit. S3 versioning also keeps previous object versions for 30 days.
- **Infrastructure change:** edit `aws/cloudformation.template.yml`, run `npm run aws:template`, commit, and run
  `scripts/aws/deploy-infra.sh`. The pipeline fails if the generated file is stale.
- **Logs:** CloudWatch log group `/aws/lambda/visa2grow-site-inquiry` (30-day retention). Alert on
  `notification FAILED` with a metric filter + alarm. The Resend dashboard shows delivery status per email.
- **Rotate the Resend key:** `aws ssm put-parameter --overwrite …` with the new value. Warm Lambdas keep the old
  key until they recycle (minutes to hours). Redeploy to apply it immediately.

## Costs (rough, low traffic)

S3 and CloudFront: a few cents to ~US$1/month. Lambda: free tier. Route 53 (option A): US$0.50/month per zone.
WAF (optional): ~US$6/month. ACM certificates: free.

## What hasn't been verified

These files are linted (`cfn-lint`) and unit tested, and the Lambda bundle was exercised locally. But nothing has
been deployed to an AWS account from this repository yet. The first real deploy and the smoke test in the pipeline
are the end-to-end check.

## Vercel alternative

`api/inquiry.ts` and `vercel.json` remain for Vercel hosting. Use one platform for production; the two don't
interfere.
