import { describe, expect, it, vi } from 'vitest';
import { submitInquiry, validateInquiry, EMPTY_INQUIRY, type Inquiry, type SubmitMeta } from './contact';

const valid: Inquiry = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  company: '',
  service: 'ai-automation',
  description: 'We would like an assistant that answers questions from our policy documents.',
  budget: '5k-15k',
  timeline: '',
};
const meta: SubmitMeta = { submissionId: 'abc12345-test', elapsedMs: 12000.4, website: '' };
const reply = (status: number, body: unknown) => async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('validateInquiry', () => {
  it('accepts valid input, trims whitespace and drops consent from the payload', () => {
    const { data, errors } = validateInquiry({ ...EMPTY_INQUIRY, ...valid, name: '  Asha Rao  ', email: ' Asha@Example.com ', consent: true });
    expect(errors).toEqual({});
    expect(data?.name).toBe('Asha Rao');
    expect(data?.email).toBe('asha@example.com');
    expect(data).not.toHaveProperty('consent');
  });

  it('requires consent and rejects unknown option values', () => {
    const { errors } = validateInquiry({ ...EMPTY_INQUIRY, ...valid, service: 'hacking', budget: '1-million', consent: false });
    expect(errors.service).toBeTruthy();
    expect(errors.budget).toBeTruthy();
    expect(errors.consent).toBeTruthy();
  });
});

describe('submitInquiry', () => {
  it('reports "unconfigured" without a request when there is no endpoint', async () => {
    const fetchImpl = vi.fn();
    expect(await submitInquiry(valid, meta, { endpoint: '', fetchImpl })).toEqual({ status: 'unconfigured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('POSTs raw field values plus meta, and reports sent only on {ok:true}', async () => {
    const fetchImpl = vi.fn(reply(200, { ok: true, id: 'abc12345-test' }));
    expect(await submitInquiry(valid, meta, { endpoint: '/api/inquiry', fetchImpl })).toEqual({ status: 'sent' });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/inquiry');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ ...valid, submissionId: 'abc12345-test', elapsedMs: 12000, website: '' });
  });

  it('does not treat a 200 without {ok:true} as success', async () => {
    const result = await submitInquiry(valid, meta, { endpoint: '/x', fetchImpl: vi.fn(async () => new Response('<html>', { status: 200 })) });
    expect(result.status).toBe('error');
  });

  it('maps server responses to clear outcomes', async () => {
    const run = (status: number, body: unknown) => submitInquiry(valid, meta, { endpoint: '/x', fetchImpl: vi.fn(reply(status, body)) });
    expect(await run(422, { ok: false, error: 'validation', fieldErrors: { email: 'Bad email' } })).toEqual({
      status: 'invalid',
      fieldErrors: { email: 'Bad email' },
    });
    expect(await run(503, { ok: false, error: 'not_configured' })).toEqual({ status: 'unconfigured' });
    expect((await run(429, { ok: false, error: 'rate_limited' })) as { message: string }).toMatchObject({ status: 'error', message: expect.stringMatching(/wait/) });
    expect(await run(502, { ok: false, error: 'delivery_failed' })).toMatchObject({ status: 'error' });
  });

  it('reports an error when the network fails', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    expect((await submitInquiry(valid, meta, { endpoint: '/x', fetchImpl })).status).toBe('error');
  });

  it('times out instead of hanging forever', async () => {
    const fetchImpl = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))),
    );
    const result = await submitInquiry(valid, meta, { endpoint: '/x', fetchImpl: fetchImpl as unknown as typeof fetch, timeoutMs: 20 });
    expect(result).toEqual({ status: 'error', message: 'The request timed out.' });
  });
});
