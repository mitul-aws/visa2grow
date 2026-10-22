/**
 * Browser side of the project inquiry: client validation (shared schema plus
 * the consent checkbox) and submission to the serverless endpoint.
 */
import * as z from 'zod/mini';
import { SITE } from './site';
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  errorsFromIssues,
  inquiryFieldsSchema,
  labelFor,
  type InquiryApiResponse,
  type InquiryErrors,
  type InquiryField,
  type InquiryFields,
} from './inquiry';

export { BUDGET_OPTIONS, NOT_SURE, SERVICE_OPTIONS, TIMELINE_OPTIONS } from './inquiry';
export type { InquiryErrors, InquiryField } from './inquiry';

/** Client-only addition: consent is required to submit, but not sent. */
const clientSchema = z.extend(inquiryFieldsSchema, {
  consent: z.literal(true, 'Please confirm you agree to us using these details to respond.'),
});

export type Inquiry = InquiryFields;

export interface InquiryFormValues {
  name: string;
  email: string;
  company: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
  consent: boolean;
}

export const EMPTY_INQUIRY: InquiryFormValues = {
  name: '',
  email: '',
  company: '',
  service: '',
  description: '',
  budget: '',
  timeline: '',
  consent: false,
};

/** Field order matters: the first invalid field in this order receives focus. */
export const FIELD_ORDER: InquiryField[] = ['name', 'email', 'company', 'service', 'description', 'budget', 'timeline', 'consent'];

export function validateInquiry(values: InquiryFormValues): { data?: Inquiry; errors: InquiryErrors } {
  const result = clientSchema.safeParse(values);
  if (!result.success) return { errors: errorsFromIssues(result.error.issues) };
  const { consent: _consent, ...data } = result.data;
  return { data, errors: {} };
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'unconfigured' }
  | { status: 'invalid'; fieldErrors: InquiryErrors }
  | { status: 'error'; message: string };

export interface SubmitMeta {
  /** Stable per form fill, so a retry never sends a duplicate email. */
  submissionId: string;
  /** Time since the form appeared, for the server's bot check. */
  elapsedMs: number;
  /** Honeypot value (should be empty). */
  website: string;
}

interface SubmitOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

const FALLBACK = 'Something went wrong on our side.';

/**
 * POSTs the inquiry to the endpoint (default /api/inquiry). Reports "sent" only
 * when the server confirms it accepted the inquiry and handed it to the email
 * provider.
 */
export async function submitInquiry(data: Inquiry, meta: SubmitMeta, opts: SubmitOptions = {}): Promise<SubmitResult> {
  const endpoint = opts.endpoint ?? SITE.contactEndpoint;
  if (!endpoint) return { status: 'unconfigured' };

  const doFetch = opts.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20000);
  try {
    const res = await doFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, ...meta, elapsedMs: Math.round(meta.elapsedMs) }),
      signal: controller.signal,
    });
    let body: InquiryApiResponse | null = null;
    try {
      body = (await res.json()) as InquiryApiResponse;
    } catch {
      body = null;
    }
    if (res.ok && body?.ok) return { status: 'sent' };
    if (body && !body.ok) {
      switch (body.error) {
        case 'validation':
          return { status: 'invalid', fieldErrors: body.fieldErrors };
        case 'rate_limited':
          return { status: 'error', message: 'Too many inquiries were sent from your connection recently. Please wait a few minutes and try again.' };
        case 'not_configured':
          return { status: 'unconfigured' };
        case 'too_large':
          return { status: 'error', message: 'Your message is too long to send. Please shorten the description.' };
        default:
          return { status: 'error', message: FALLBACK };
      }
    }
    return { status: 'error', message: res.status === 404 ? 'The inquiry service is not available here.' : FALLBACK };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    return {
      status: 'error',
      message: aborted ? 'The request timed out.' : 'We couldn’t reach the server. Please check your connection.',
    };
  } finally {
    clearTimeout(timer);
  }
}

/** mailto: fallback with the inquiry pre-filled. */
export function mailtoHref(email: string, v: InquiryFormValues): string {
  const lines = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.company && `Company: ${v.company}`,
    v.service && `Service: ${labelFor(SERVICE_OPTIONS, v.service)}`,
    v.budget && `Budget: ${labelFor(BUDGET_OPTIONS, v.budget)}`,
    v.timeline && `Timeline: ${labelFor(TIMELINE_OPTIONS, v.timeline)}`,
    '',
    v.description,
  ].filter((l): l is string => typeof l === 'string');
  return `mailto:${email}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
}
