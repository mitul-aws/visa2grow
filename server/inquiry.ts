/**
 * Project inquiry endpoint, written against the Web Fetch API (Request ->
 * Response) so the same code runs on Vercel (api/inquiry.ts), in the Vite dev
 * server and in the local preview server.
 *
 * Flow: method/CORS/content-type/size checks -> rate limit -> parse + validate
 * -> spam checks (honeypot, too-fast) -> send notification via Resend.
 *
 * Privacy: never log names, emails, descriptions or the API key. Logs carry
 * only an inquiry id, the outcome and provider status codes.
 */
import { Resend } from 'resend';
import {
  BUDGET_OPTIONS,
  LIMITS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  errorsFromIssues,
  inquiryRequestSchema,
  labelFor,
  type InquiryApiResponse,
  type InquiryFields,
} from '../src/lib/inquiry';
import { renderInquiryEmail } from './inquiry-email';

export interface InquiryConfig {
  resendApiKey?: string;
  notificationEmail?: string;
  fromEmail?: string;
  /** Exact origins allowed to POST (production domain, preview URLs, localhost in dev). */
  allowedOrigins: string[];
}

export interface OutgoingEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  /** Extra headers, e.g. X-Entity-Ref-ID to stop mail clients grouping inquiries. */
  headers: Record<string, string>;
}

/** Returns the provider's message id, or throws a ProviderError. */
export type SendEmail = (email: OutgoingEmail, apiKey: string) => Promise<string>;

export class ProviderError extends Error {
  constructor(
    public readonly statusCode: number | null,
    public readonly code: string,
  ) {
    super(`Email provider error ${code}${statusCode ? ` (${statusCode})` : ''}`);
  }
}

export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface InquiryDeps {
  config: InquiryConfig;
  sendEmail?: SendEmail;
  rateLimiter?: RateLimiter;
  logger?: Logger;
  now?: () => Date;
}

/** Submissions faster than this after the form appeared are treated as bots. */
export const MIN_FILL_MS = 2500;

export const resendSender: SendEmail = async (email, apiKey) => {
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from: email.from,
      to: email.to,
      replyTo: email.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: email.headers,
      tags: [{ name: 'category', value: 'project_inquiry' }],
    },
    { idempotencyKey: email.idempotencyKey },
  );
  if (error || !data) throw new ProviderError(error?.statusCode ?? null, error?.name ?? 'unknown_error');
  return data.id;
};

/**
 * Best-effort fixed-window limiter. Serverless instances don't share memory,
 * so this only slows down bursts hitting one instance. For production-grade
 * limits, add a Vercel Firewall rate-limit rule or a shared store (README).
 */
export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();
  constructor(
    private readonly limit = 5,
    private readonly windowMs = 10 * 60 * 1000,
  ) {}
  allow(key: string, now = Date.now()): boolean {
    if (this.hits.size > 5000) this.hits.clear();
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= this.limit;
  }
}

const defaultLimiter = new RateLimiter();

const consoleLogger: Logger = {
  info: (msg, meta) => console.info(`[inquiry] ${msg}`, meta ?? ''),
  error: (msg, meta) => console.error(`[inquiry] ${msg}`, meta ?? ''),
};

function json(body: InquiryApiResponse, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

function corsHeaders(origin: string | null, config: InquiryConfig): Record<string, string> {
  if (!origin || !config.allowedOrigins.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

function clientKey(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

/** Short, human-friendly reference shown in the subject, e.g. "4DD581". */
export const shortRef = (id: string) => id.replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase();

/** Removes characters that could break a header line or look odd in a subject. */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

export function buildNotification(fields: InquiryFields, config: Required<Pick<InquiryConfig, 'fromEmail' | 'notificationEmail'>>, submittedAt: Date, id: string): OutgoingEmail {
  const service = labelFor(SERVICE_OPTIONS, fields.service);
  const view = {
    id,
    name: fields.name,
    email: fields.email,
    company: fields.company,
    service,
    description: fields.description,
    budget: fields.budget ? labelFor(BUDGET_OPTIONS, fields.budget) : '',
    timeline: fields.timeline ? labelFor(TIMELINE_OPTIONS, fields.timeline) : '',
    submittedAt,
  };
  const { html, text } = renderInquiryEmail(view);
  return {
    from: config.fromEmail,
    to: config.notificationEmail,
    replyTo: fields.email,
    // Name + short reference make every subject unique, so Gmail and Outlook
    // show each inquiry as its own email instead of grouping them by service.
    subject: oneLine(`[Visa2Grow] New Project Inquiry — ${service} — ${fields.name} (#${shortRef(id)})`),
    html,
    text,
    idempotencyKey: `inquiry-${id}`,
    // Unique per message; Gmail uses it to keep otherwise similar emails apart.
    headers: { 'X-Entity-Ref-ID': id },
  };
}

export async function handleInquiry(request: Request, deps: InquiryDeps): Promise<Response> {
  const { config } = deps;
  const log = deps.logger ?? consoleLogger;
  const limiter = deps.rateLimiter ?? defaultLimiter;
  const send = deps.sendEmail ?? resendSender;
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin, config);

  if (origin && !config.allowedOrigins.includes(origin)) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'bad_request' }, 405, { ...cors, Allow: 'POST, OPTIONS' });
  }
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: 'bad_request' }, 415, cors);
  }
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > LIMITS.requestBytes) {
    return json({ ok: false, error: 'too_large' }, 413, cors);
  }

  if (!limiter.allow(clientKey(request))) {
    log.info('rate limited');
    return json({ ok: false, error: 'rate_limited' }, 429, { ...cors, 'Retry-After': '600' });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400, cors);
  }
  if (new TextEncoder().encode(raw).length > LIMITS.requestBytes) {
    return json({ ok: false, error: 'too_large' }, 413, cors);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400, cors);
  }

  const parsed = inquiryRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = errorsFromIssues(parsed.error.issues);
    // Errors on meta fields (honeypot, timing, id) are not the visitor's to fix.
    const visible = Object.fromEntries(
      Object.entries(fieldErrors).filter(([k]) => !['website', 'elapsedMs', 'submissionId'].includes(k)),
    );
    return Object.keys(visible).length
      ? json({ ok: false, error: 'validation', fieldErrors: visible }, 422, cors)
      : json({ ok: false, error: 'bad_request' }, 400, cors);
  }
  const data = parsed.data;
  const id = data.submissionId ?? crypto.randomUUID();

  // Spam: honeypot filled or submitted implausibly fast. Answer like a success
  // so bots learn nothing, but send nothing.
  if ((data.website ?? '').trim() !== '' || (data.elapsedMs !== undefined && data.elapsedMs < MIN_FILL_MS)) {
    log.info('discarded as likely spam', { id });
    return json({ ok: true, id }, 200, cors);
  }

  const missing = (['resendApiKey', 'notificationEmail', 'fromEmail'] as const).filter((k) => !config[k]);
  if (missing.length) {
    const names = { resendApiKey: 'RESEND_API_KEY', notificationEmail: 'INQUIRY_NOTIFICATION_EMAIL', fromEmail: 'INQUIRY_FROM_EMAIL' };
    log.error('not configured; inquiry NOT delivered', { id, missing: missing.map((k) => names[k]) });
    return json({ ok: false, error: 'not_configured' }, 503, cors);
  }

  const { name, email, company, service, description, budget, timeline } = data;
  const message = buildNotification(
    { name, email, company, service, description, budget, timeline },
    { fromEmail: config.fromEmail!, notificationEmail: config.notificationEmail! },
    (deps.now ?? (() => new Date()))(),
    id,
  );

  try {
    const providerId = await send(message, config.resendApiKey!);
    log.info('notification sent', { id, providerId });
    return json({ ok: true, id }, 200, cors);
  } catch (err) {
    const meta = err instanceof ProviderError ? { status: err.statusCode, code: err.code } : { code: 'exception' };
    // Not silently discarded: this line is the alert hook (see README, "Monitoring").
    log.error('notification FAILED; inquiry NOT delivered', { id, ...meta });
    return json({ ok: false, error: 'delivery_failed' }, 502, cors);
  }
}

/** Reads configuration from server-side environment variables. */
export function configFromEnv(env: Record<string, string | undefined>): InquiryConfig {
  const origins = new Set<string>();
  const siteUrl = (env.SITE_URL ?? env.VITE_SITE_URL ?? 'https://www.visa2grow.com').replace(/\/+$/, '');
  origins.add(siteUrl);
  // Allow both apex and www for the production domain.
  try {
    const u = new URL(siteUrl);
    origins.add(`${u.protocol}//${u.host.startsWith('www.') ? u.host.slice(4) : `www.${u.host}`}`);
  } catch {
    /* ignore malformed SITE_URL */
  }
  for (const o of (env.INQUIRY_ALLOWED_ORIGINS ?? '').split(',')) if (o.trim()) origins.add(o.trim().replace(/\/+$/, ''));
  // Vercel preview/production deployment URLs.
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) if (host) origins.add(`https://${host}`);
  return {
    resendApiKey: env.RESEND_API_KEY?.trim() || undefined,
    notificationEmail: env.INQUIRY_NOTIFICATION_EMAIL?.trim() || undefined,
    fromEmail: env.INQUIRY_FROM_EMAIL?.trim() || undefined,
    allowedOrigins: [...origins],
  };
}
