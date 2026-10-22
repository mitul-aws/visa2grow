// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { configFromEnv, handleInquiry, ProviderError, RateLimiter, MIN_FILL_MS, type InquiryConfig, type OutgoingEmail, type SendEmail } from './inquiry';
import { escapeHtml } from './inquiry-email';

const ORIGIN = 'https://visa2grow.com';
const config: InquiryConfig = {
  resendApiKey: 're_test_key_never_logged',
  notificationEmail: 'sales@visa2grow.com',
  fromEmail: 'Visa2Grow Website <inquiries@visa2grow.com>',
  allowedOrigins: [ORIGIN],
};

const valid = {
  name: 'Asha Rao',
  email: 'Asha@Example.com ',
  company: 'Rao Clinics',
  service: 'mobile-app-development',
  description: 'We need an appointment booking app for three clinics, with reminders and payments.',
  budget: '15k-40k',
  timeline: '1-3-months',
  website: '',
  elapsedMs: 15000,
  submissionId: 'test-submission-0001',
};

function post(body: unknown, init: { origin?: string | null; headers?: Record<string, string>; method?: string; raw?: string } = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}`, ...init.headers };
  if (init.origin !== null) headers.Origin = init.origin ?? ORIGIN;
  const payload = init.raw ?? JSON.stringify(body);
  return new Request('https://visa2grow.com/api/inquiry', {
    method: init.method ?? 'POST',
    headers: { ...headers, 'Content-Length': String(new TextEncoder().encode(payload).length) },
    body: init.method === 'GET' ? undefined : payload,
  });
}

function setup(overrides: { send?: SendEmail; config?: Partial<InquiryConfig>; limiter?: RateLimiter } = {}) {
  const sent: OutgoingEmail[] = [];
  const send = vi.fn(overrides.send ?? (async (email: OutgoingEmail) => (sent.push(email), 'msg_123')));
  const logs: string[] = [];
  const logger = {
    info: (m: string, meta?: Record<string, unknown>) => logs.push(`INFO ${m} ${JSON.stringify(meta ?? {})}`),
    error: (m: string, meta?: Record<string, unknown>) => logs.push(`ERROR ${m} ${JSON.stringify(meta ?? {})}`),
  };
  const run = (req: Request) =>
    handleInquiry(req, {
      config: { ...config, ...overrides.config },
      sendEmail: send,
      logger,
      rateLimiter: overrides.limiter ?? new RateLimiter(100),
      now: () => new Date('2026-10-22T06:30:00Z'),
    });
  return { run, send, sent, logs };
}

describe('POST /api/inquiry — valid submissions', () => {
  it('sends one notification with every field, the right subject, sender and Reply-To', async () => {
    const { run, sent } = setup();
    const res = await run(post(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: 'test-submission-0001' });
    expect(sent).toHaveLength(1);
    const email = sent[0]!;
    expect(email.to).toBe('sales@visa2grow.com');
    expect(email.from).toBe('Visa2Grow Website <inquiries@visa2grow.com>');
    expect(email.replyTo).toBe('asha@example.com'); // trimmed + normalised visitor address
    expect(email.subject).toBe('[Visa2Grow] New Project Inquiry — Mobile App Development — Asha Rao (#TESTSU)');
    expect(email.headers['X-Entity-Ref-ID']).toBe('test-submission-0001');
    expect(email.idempotencyKey).toBe('inquiry-test-submission-0001');
    for (const part of [email.html, email.text]) {
      for (const expected of ['Asha Rao', 'asha@example.com', 'Rao Clinics', 'Mobile App Development', 'appointment booking app', '$15,000 – $40,000', 'Within 1–3 months', '22 Oct 2026']) {
        expect(part).toContain(expected);
      }
    }
    expect(email.text).toContain('2026-10-22T06:30:00.000Z');
  });

  it('marks optional fields as not provided', async () => {
    const { run, sent } = setup();
    await run(post({ ...valid, company: '', budget: '', timeline: '' }));
    expect(sent[0]!.text).toContain('Company: Not provided');
    expect(sent[0]!.text).toContain('Budget range: Not provided');
    expect(sent[0]!.text).toContain('Expected timeline: Not provided');
  });

  it('escapes HTML in every visitor-supplied value', async () => {
    const { run, sent } = setup();
    await run(
      post({
        ...valid,
        name: '<img src=x onerror=alert(1)>',
        company: '"><script>alert(1)</script>',
        description: 'Hello <b>bold</b> & <a href="https://evil.example">click</a>\nsecond line here please',
      }),
    );
    const html = sent[0]!.html;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<b>bold</b>');
    expect(html).not.toContain('href="https://evil.example"');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('second line here please');
    expect(escapeHtml(`<"'&>`)).toBe('&lt;&quot;&#39;&amp;&gt;');
  });

  it('gives every inquiry its own subject and ref header so mail clients do not group them', async () => {
    const { run, sent } = setup();
    await run(post({ ...valid, submissionId: 'aaaa1111-first' }));
    await run(post({ ...valid, submissionId: 'bbbb2222-second' }));
    expect(sent).toHaveLength(2);
    expect(sent[0]!.subject).not.toBe(sent[1]!.subject);
    expect(sent[0]!.headers['X-Entity-Ref-ID']).not.toBe(sent[1]!.headers['X-Entity-Ref-ID']);
    expect(sent[0]!.subject).toContain('(#AAAA11)');
  });

  it('strips line breaks from the subject', async () => {
    const { run, sent } = setup();
    await run(post({ ...valid, name: 'Asha\r\nBcc: x@example.com' }));
    expect(sent[0]!.subject).not.toMatch(/[\r\n]/);
  });
});

describe('POST /api/inquiry — rejected input', () => {
  it.each([
    ['malformed email', { email: 'not-an-email' }, 'email'],
    ['missing name', { name: '' }, 'name'],
    ['unknown service', { service: 'hacking' }, 'service'],
    ['short description', { description: 'too short' }, 'description'],
    ['oversized description', { description: 'x'.repeat(4001) }, 'description'],
    ['invalid budget', { budget: '1-million' }, 'budget'],
    ['invalid timeline', { timeline: 'yesterday' }, 'timeline'],
  ])('rejects %s with a field error and sends nothing', async (_label, patch, field) => {
    const { run, send } = setup();
    const res = await run(post({ ...valid, ...patch }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe('validation');
    expect(body.fieldErrors[field]).toBeTruthy();
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects bodies over the size limit', async () => {
    const { run, send } = setup();
    const res = await run(post({ ...valid, description: 'x'.repeat(20_000) }));
    expect(res.status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON and wrong content types', async () => {
    const { run } = setup();
    expect((await run(post(null, { raw: '{not json' }))).status).toBe(400);
    expect((await run(post(valid, { headers: { 'Content-Type': 'text/plain' } }))).status).toBe(415);
  });

  it('only accepts POST (and OPTIONS preflight)', async () => {
    const { run } = setup();
    const res = await run(post(null, { method: 'GET' }));
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST, OPTIONS');
    const pre = await run(new Request('https://visa2grow.com/api/inquiry', { method: 'OPTIONS', headers: { Origin: ORIGIN } }));
    expect(pre.status).toBe(204);
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
  });

  it('refuses other origins and never reflects them in CORS headers', async () => {
    const { run, send } = setup();
    const res = await run(post(valid, { origin: 'https://evil.example' }));
    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });
});

describe('POST /api/inquiry — spam and abuse', () => {
  it('silently discards honeypot submissions', async () => {
    const { run, send } = setup();
    const res = await run(post({ ...valid, website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('silently discards submissions made faster than a person could type', async () => {
    const { run, send } = setup();
    const res = await run(post({ ...valid, elapsedMs: MIN_FILL_MS - 1 }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('rate limits repeated submissions from one address', async () => {
    const { run, send } = setup({ limiter: new RateLimiter(2, 60_000) });
    const from = { headers: { 'x-forwarded-for': '203.0.113.9' } };
    expect((await run(post(valid, from))).status).toBe(200);
    expect((await run(post(valid, from))).status).toBe(200);
    const third = await run(post(valid, from));
    expect(third.status).toBe(429);
    expect(third.headers.get('Retry-After')).toBeTruthy();
    expect(send).toHaveBeenCalledTimes(2);
  });
});

describe('POST /api/inquiry — configuration and provider failures', () => {
  it.each(['resendApiKey', 'notificationEmail', 'fromEmail'] as const)('returns 503 and logs (by name only) when %s is missing', async (key) => {
    const { run, send, logs } = setup({ config: { [key]: undefined } });
    const res = await run(post(valid));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: 'not_configured' });
    expect(send).not.toHaveBeenCalled();
    expect(logs.join('\n')).toMatch(/not configured/);
  });

  it('returns a generic 502 on provider errors, logs it, and leaks no details or personal data', async () => {
    const { run, logs } = setup({
      send: async () => {
        throw new ProviderError(403, 'validation_error');
      },
    });
    const res = await run(post(valid));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: 'delivery_failed' });
    const logText = logs.join('\n');
    expect(logText).toContain('FAILED');
    expect(logText).toContain('validation_error');
    for (const secret of ['Asha', 'asha@example.com', 'Rao Clinics', 'appointment', 're_test_key_never_logged']) {
      expect(logText).not.toContain(secret);
    }
  });

  it('never logs personal data on success either', async () => {
    const { run, logs } = setup();
    await run(post(valid));
    expect(logs.join('\n')).not.toMatch(/Asha|example\.com|Clinics|appointment|re_test/);
  });
});

describe('configFromEnv', () => {
  it('reads server-only variables and allows apex, www and Vercel deployment URLs', () => {
    const cfg = configFromEnv({
      RESEND_API_KEY: ' re_x ',
      INQUIRY_NOTIFICATION_EMAIL: 'sales@visa2grow.com',
      INQUIRY_FROM_EMAIL: 'Visa2Grow <inquiries@visa2grow.com>',
      VERCEL_URL: 'visa2grow-abc.vercel.app',
      INQUIRY_ALLOWED_ORIGINS: 'http://localhost:5173',
    });
    expect(cfg.resendApiKey).toBe('re_x');
    expect(cfg.allowedOrigins).toEqual(
      expect.arrayContaining(['https://visa2grow.com', 'https://www.visa2grow.com', 'https://visa2grow-abc.vercel.app', 'http://localhost:5173']),
    );
  });

  it('treats empty variables as missing', () => {
    expect(configFromEnv({ RESEND_API_KEY: '  ' }).resendApiKey).toBeUndefined();
  });
});
