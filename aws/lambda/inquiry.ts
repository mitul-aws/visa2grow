/**
 * AWS Lambda entry for POST /api/inquiry (Lambda Function URL behind CloudFront).
 *
 * Wraps the same Fetch-API handler used on Vercel and in local dev
 * (server/inquiry.ts), so validation, spam checks and the email are identical.
 *
 * Environment (set by aws/cloudformation.yml):
 *   RESEND_API_KEY_PARAM        SSM SecureString name holding the Resend key
 *   INQUIRY_NOTIFICATION_EMAIL  e.g. sales@visa2grow.com
 *   INQUIRY_FROM_EMAIL          e.g. Visa2Grow Website <inquiries@visa2grow.com>
 *   SITE_URL                    canonical origin, e.g. https://www.visa2grow.com
 *   ORIGIN_VERIFY_SECRET        shared secret CloudFront adds as X-Origin-Verify;
 *                               requests without it (direct calls to the function
 *                               URL) are refused
 *
 * CloudFront also sends X-Viewer-Host (the domain the visitor used). Once the
 * request is proven to come from CloudFront, that host counts as same-origin,
 * so the site works on its *.cloudfront.net address before DNS is switched.
 */
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { configFromEnv, handleInquiry, type InquiryConfig } from '../../server/inquiry';

/** Subset of the Lambda Function URL (payload v2.0) event we use. */
export interface FunctionUrlEvent {
  rawPath: string;
  rawQueryString?: string;
  headers?: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext: { http: { method: string; sourceIp?: string } };
}

export interface FunctionUrlResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

let cachedKey: string | undefined;
let ssm: SSMClient | undefined;

/** Reads the Resend key from SSM once per warm container. */
export async function loadApiKey(env: NodeJS.ProcessEnv, client?: Pick<SSMClient, 'send'>): Promise<string | undefined> {
  if (cachedKey) return cachedKey;
  if (env.RESEND_API_KEY) return env.RESEND_API_KEY; // allowed for local testing only
  const name = env.RESEND_API_KEY_PARAM;
  if (!name) return undefined;
  const c = client ?? (ssm ??= new SSMClient({}));
  try {
    const out = await c.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
    cachedKey = out.Parameter?.Value?.trim() || undefined;
  } catch (err) {
    // Name of the error only; never the parameter value.
    console.error('[inquiry] could not read Resend key from SSM', { code: (err as { name?: string }).name });
  }
  return cachedKey;
}

/** Test hook. */
export function resetKeyCache() {
  cachedKey = undefined;
}

function toRequest(event: FunctionUrlEvent): Request {
  const headers = new Headers();
  for (const [k, v] of Object.entries(event.headers ?? {})) if (v !== undefined) headers.set(k, v);
  const host = headers.get('host') ?? 'lambda.local';
  const url = `https://${host}${event.rawPath}${event.rawQueryString ? `?${event.rawQueryString}` : ''}`;
  const method = event.requestContext.http.method;
  const body =
    method === 'GET' || method === 'HEAD' || event.body === undefined
      ? undefined
      : event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
  // Function URLs don't send Content-Length; the handler re-measures the body anyway.
  return new Request(url, { method, headers, body });
}

async function toResult(response: Response): Promise<FunctionUrlResult> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => (headers[key] = value));
  return { statusCode: response.status, headers, body: await response.text() };
}

export async function handler(event: FunctionUrlEvent, env: NodeJS.ProcessEnv = process.env): Promise<FunctionUrlResult> {
  const expected = env.ORIGIN_VERIFY_SECRET;
  const provided = event.headers?.['x-origin-verify'];
  if (expected && provided !== expected) {
    return { statusCode: 403, headers: { 'content-type': 'application/json' }, body: '{"ok":false,"error":"forbidden"}' };
  }
  const config: InquiryConfig = configFromEnv(env);
  const viewerHost = event.headers?.['x-viewer-host'];
  if (expected && viewerHost && /^[a-z0-9.-]+$/i.test(viewerHost)) config.allowedOrigins.push(`https://${viewerHost}`);
  config.resendApiKey = await loadApiKey(env);
  return toResult(await handleInquiry(toRequest(event), { config }));
}
