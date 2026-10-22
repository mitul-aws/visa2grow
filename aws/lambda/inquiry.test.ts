// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handler, loadApiKey, resetKeyCache, type FunctionUrlEvent } from './inquiry';

const env = {
  ORIGIN_VERIFY_SECRET: 'cf-shared-secret',
  INQUIRY_NOTIFICATION_EMAIL: 'sales@visa2grow.com',
  INQUIRY_FROM_EMAIL: 'Visa2Grow Website <inquiries@visa2grow.com>',
  SITE_URL: 'https://visa2grow.com',
} as NodeJS.ProcessEnv;

const valid = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  company: '',
  service: 'web-development',
  description: 'We need a customer portal for booking and paying for maintenance visits.',
  budget: '',
  timeline: '',
  website: '',
  elapsedMs: 9000,
  submissionId: 'lambda-test-0001',
};

function event({ headers: extra, ...over }: Partial<FunctionUrlEvent> & { headers?: Record<string, string> } = {}): FunctionUrlEvent {
  return {
    rawPath: '/api/inquiry',
    headers: {
      host: 'abc.lambda-url.ap-south-1.on.aws',
      origin: 'https://visa2grow.com',
      'content-type': 'application/json',
      'x-forwarded-for': '198.51.100.7, 130.176.0.1',
      'x-origin-verify': 'cf-shared-secret',
      ...extra,
    },
    body: JSON.stringify(valid),
    requestContext: { http: { method: 'POST' } },
    ...over,
  } as FunctionUrlEvent;
}

afterEach(() => resetKeyCache());

describe('inquiry Lambda', () => {
  it('refuses calls that did not come through CloudFront', async () => {
    const res = await handler(event({ headers: { 'x-origin-verify': 'wrong' } }), env);
    expect(res.statusCode).toBe(403);
  });

  it('answers the CORS preflight for the production origin', async () => {
    const res = await handler(event({ requestContext: { http: { method: 'OPTIONS' } }, body: undefined }), env);
    expect(res.statusCode).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('https://visa2grow.com');
  });

  it('treats the CloudFront viewer host as same-origin, but not other sites', async () => {
    const cf = { origin: 'https://d111abcdef8.cloudfront.net', 'x-viewer-host': 'd111abcdef8.cloudfront.net' };
    const ok = await handler(event({ headers: cf, body: JSON.stringify({ ...valid, email: 'bad' }) }), env);
    expect(ok.statusCode).toBe(422); // passed the origin check, reached validation
    const evil = await handler(event({ headers: { origin: 'https://evil.example', 'x-viewer-host': 'visa2grow.com' } }), env);
    expect(evil.statusCode).toBe(403);
  });

  it('validates input (including base64-encoded bodies)', async () => {
    const body = Buffer.from(JSON.stringify({ ...valid, email: 'nope' })).toString('base64');
    const res = await handler(event({ body, isBase64Encoded: true }), env);
    expect(res.statusCode).toBe(422);
    expect(JSON.parse(res.body).fieldErrors.email).toBeTruthy();
  });

  it('returns 503 when the Resend key is not available', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handler(event(), env);
    expect(res.statusCode).toBe(503);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: 'not_configured' });
    spy.mockRestore();
  });

  it('reads the key from SSM once and caches it', async () => {
    const send = vi.fn(async () => ({ Parameter: { Value: ' re_from_ssm ' } }));
    const e = { RESEND_API_KEY_PARAM: '/visa2grow/resend-api-key' } as NodeJS.ProcessEnv;
    expect(await loadApiKey(e, { send } as never)).toBe('re_from_ssm');
    expect(await loadApiKey(e, { send } as never)).toBe('re_from_ssm');
    expect(send).toHaveBeenCalledTimes(1);
    const cmd = (send.mock.calls[0] as unknown as [{ input: { Name: string; WithDecryption: boolean } }])[0];
    expect(cmd.input).toEqual({ Name: '/visa2grow/resend-api-key', WithDecryption: true });
  });

  it('logs only the error name if SSM fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const send = vi.fn(async () => {
      throw Object.assign(new Error('secret details'), { name: 'AccessDeniedException' });
    });
    expect(await loadApiKey({ RESEND_API_KEY_PARAM: '/x' } as NodeJS.ProcessEnv, { send } as never)).toBeUndefined();
    expect(JSON.stringify(spy.mock.calls)).toContain('AccessDeniedException');
    expect(JSON.stringify(spy.mock.calls)).not.toContain('secret details');
    spy.mockRestore();
  });
});
