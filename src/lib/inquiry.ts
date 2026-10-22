/**
 * Project inquiry: fields, options and validation shared by the browser form
 * and the serverless endpoint (server/inquiry.ts).
 *
 * Keep this file free of browser-only or Vite-only code (no import.meta.env,
 * no "@/" path aliases): it is bundled into the server function too.
 */
// zod/mini: same validation engine, tree-shakable API, a fraction of the size.
import * as z from 'zod/mini';
import { SERVICES } from '../data/services';

export const NOT_SURE = 'not-sure';

export const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.slug, label: s.name })),
  { value: NOT_SURE, label: 'Not sure yet' },
];

/** Edit freely; the currency and bands are a business decision. */
export const BUDGET_OPTIONS = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 – $15,000' },
  { value: '15k-40k', label: '$15,000 – $40,000' },
  { value: '40k-plus', label: '$40,000+' },
  { value: 'unsure', label: 'Not sure yet' },
];

export const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: 'Within 3–6 months' },
  { value: 'exploring', label: 'Just exploring' },
];

export const LIMITS = {
  name: 100,
  email: 200,
  company: 150,
  descriptionMin: 30,
  description: 4000,
  /** Whole JSON request body, in bytes. Comfortably above a maximal valid inquiry. */
  requestBytes: 16 * 1024,
} as const;

const values = <T extends { value: string }>(opts: T[]) => opts.map((o) => o.value) as [string, ...string[]];

export const labelFor = (opts: Array<{ value: string; label: string }>, v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

/** The inquiry fields themselves, as validated on both client and server. */
export const inquiryFieldsSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, 'Please enter your name.'),
      z.maxLength(LIMITS.name, `Please keep your name under ${LIMITS.name} characters.`),
    ),
  // Normalise first (trim, lower-case), then validate the cleaned value.
  email: z.pipe(
    z.string().check(z.trim(), z.toLowerCase()),
    z.email('Please enter a valid email address, like name@company.com.').check(
      z.maxLength(LIMITS.email, 'That email address is too long.'),
    ),
  ),
  company: z
    .string()
    .check(z.trim(), z.maxLength(LIMITS.company, `Please keep this under ${LIMITS.company} characters.`)),
  service: z.enum(values(SERVICE_OPTIONS), 'Please choose the service that fits best, or “Not sure yet”.'),
  description: z
    .string()
    .check(
      z.trim(),
      z.minLength(LIMITS.descriptionMin, 'Please describe your project in at least 30 characters so we can reply usefully.'),
      z.maxLength(LIMITS.description, 'Please keep the description under 4,000 characters.'),
    ),
  budget: z.union([z.literal(''), z.enum(values(BUDGET_OPTIONS))], 'Please choose a budget range from the list.'),
  timeline: z.union([z.literal(''), z.enum(values(TIMELINE_OPTIONS))], 'Please choose a timeline from the list.'),
});

export type InquiryFields = z.infer<typeof inquiryFieldsSchema>;
export type InquiryField = keyof InquiryFields | 'consent';
export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** What the browser POSTs to the endpoint. */
export const inquiryRequestSchema = z.extend(inquiryFieldsSchema, {
  /** Honeypot. Real visitors never see or fill it. */
  website: z.optional(z.string().check(z.maxLength(500))),
  /** Milliseconds between the form appearing and submit; bots are usually instant. */
  elapsedMs: z.optional(z.int().check(z.minimum(0))),
  /** Random per-submission id, used as the email idempotency key. */
  submissionId: z.optional(z.string().check(z.regex(/^[A-Za-z0-9-]{8,64}$/))),
});

export type InquiryRequest = z.infer<typeof inquiryRequestSchema>;

/** Collects the first message per top-level field from a zod error. */
export function errorsFromIssues(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>): InquiryErrors {
  const errors: InquiryErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in errors)) errors[key as InquiryField] = issue.message;
  }
  return errors;
}

/** API response bodies. */
export type InquiryApiResponse =
  | { ok: true; id: string }
  | { ok: false; error: 'validation'; fieldErrors: InquiryErrors }
  | { ok: false; error: 'rate_limited' | 'not_configured' | 'delivery_failed' | 'bad_request' | 'forbidden' | 'too_large' };
