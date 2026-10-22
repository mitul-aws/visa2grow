import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CircleAlert, CircleCheck, LoaderCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, controlClass, describedBy } from './Field';
import {
  BUDGET_OPTIONS,
  EMPTY_INQUIRY,
  FIELD_ORDER,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  mailtoHref,
  submitInquiry,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryFormValues,
  type SubmitResult,
} from '@/lib/contact';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'submitting' | Exclude<SubmitResult['status'], 'invalid'>;

interface ContactFormProps {
  /** Pre-selected service slug, e.g. from ?service= on the URL. */
  initialService?: string;
  /** Injected for tests. */
  submit?: typeof submitInquiry;
  contactEmail?: string;
}

function newSubmissionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

const FIELD_LABELS: Record<InquiryField, string> = {
  name: 'Name',
  email: 'Business email',
  company: 'Company',
  service: 'Service',
  description: 'Project description',
  budget: 'Budget range',
  timeline: 'Timeline',
  consent: 'Privacy acknowledgement',
};

export function ContactForm({ initialService, submit = submitInquiry, contactEmail = SITE.contactEmail }: ContactFormProps) {
  const [values, setValues] = useState<InquiryFormValues>(EMPTY_INQUIRY);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  // Guards against double submits even before React re-renders.
  const inFlight = useRef(false);
  const startedAt = useRef<number | null>(null);
  // One id per form fill: retries reuse it, so the server never emails twice.
  const submissionId = useRef<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Applied after mount so the prerendered HTML and first client render match.
  useEffect(() => {
    if (initialService && SERVICE_OPTIONS.some((o) => o.value === initialService)) {
      setValues((v) => (v.service ? v : { ...v, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (status === 'sent' || status === 'unconfigured' || status === 'error') resultRef.current?.focus();
  }, [status]);

  const update = (field: keyof InquiryFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const next = { ...values, [field]: value };
    setValues(next);
    // After the first submit attempt, re-validate as the user fixes things.
    if (attempted) setErrors(validateInquiry(next).errors);
    if (status === 'error' || status === 'unconfigured') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    setAttempted(true);
    const { data, errors: found } = validateInquiry(values);
    setErrors(found);
    if (!data) {
      const first = FIELD_ORDER.find((f) => found[f]);
      // The summary is role="alert" so it is announced; focus goes to the first problem.
      if (first) document.getElementById(`inquiry-${first}`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus('submitting');
    submissionId.current ??= newSubmissionId();
    try {
      const result = await submit(data, {
        submissionId: submissionId.current,
        elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
        website: honeypot,
      });
      if (result.status === 'invalid') {
        // The server disagreed with client validation: show its field messages.
        setErrors(result.fieldErrors);
        setStatus('idle');
        const first = FIELD_ORDER.find((f) => result.fieldErrors[f]);
        if (first) document.getElementById(`inquiry-${first}`)?.focus();
        return;
      }
      if (result.status === 'error') setErrorMessage(result.message);
      setStatus(result.status);
    } finally {
      inFlight.current = false;
    }
  };

  if (status === 'sent') {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="rounded-xl border border-success/25 bg-[#effaf5] p-8 focus:outline-none">
        <CircleCheck aria-hidden className="size-10 text-success" />
        <h2 className="mt-4 text-2xl font-bold text-ink">Thank you, your inquiry was sent.</h2>
        <p className="mt-3 leading-relaxed text-muted">
          We’ll read it carefully and reply to <strong className="font-semibold text-ink">{values.email}</strong> with any
          questions and a suggested next step.
        </p>
        <p className="mt-6">
          <Link to="/insights" className="font-semibold text-blue hover:underline">
            Read our insights while you wait →
          </Link>
        </p>
      </div>
    );
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const submitting = status === 'submitting';

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="inquiry-required-note" className="space-y-6">
      <p id="inquiry-required-note" className="text-sm text-muted">
        All fields are required unless marked optional.
      </p>

      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className={cn('rounded-lg border border-danger/30 bg-[#fdf2f3] p-4 focus:outline-none', errorList.length === 0 && 'hidden')}
      >
        {errorList.length > 0 && (
          <>
            <p className="flex items-center gap-2 font-semibold text-danger">
              <CircleAlert aria-hidden className="size-4.5" />
              Please fix {errorList.length === 1 ? '1 field' : `${errorList.length} fields`} below.
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-ink">
              {errorList.map((f) => (
                <li key={f}>
                  <a href={`#inquiry-${f}`} className="underline underline-offset-2 hover:text-danger">
                    {FIELD_LABELS[f]}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="inquiry-name" label="Name" error={errors.name}>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('inquiry-name', { error: !!errors.name })}
            className={cn(controlClass(!!errors.name), 'h-12')}
          />
        </Field>
        <Field id="inquiry-email" label="Business email" error={errors.email}>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('inquiry-email', { error: !!errors.email })}
            className={cn(controlClass(!!errors.email), 'h-12')}
          />
        </Field>
        <Field id="inquiry-company" label="Company" optional error={errors.company}>
          <input
            id="inquiry-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={update('company')}
            aria-invalid={!!errors.company}
            aria-describedby={describedBy('inquiry-company', { error: !!errors.company })}
            className={cn(controlClass(!!errors.company), 'h-12')}
          />
        </Field>
        <Field id="inquiry-service" label="Service" error={errors.service}>
          <select
            id="inquiry-service"
            name="service"
            value={values.service}
            onChange={update('service')}
            aria-invalid={!!errors.service}
            aria-describedby={describedBy('inquiry-service', { error: !!errors.service })}
            className={cn(controlClass(!!errors.service), 'h-12 pr-10')}
          >
            <option value="">Choose a service…</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="inquiry-description"
        label="Project description"
        hint="What are you building, who is it for, and what does success look like?"
        error={errors.description}
      >
        <textarea
          id="inquiry-description"
          name="description"
          rows={6}
          value={values.description}
          onChange={update('description')}
          aria-invalid={!!errors.description}
          aria-describedby={describedBy('inquiry-description', { hint: true, error: !!errors.description })}
          className={cn(controlClass(!!errors.description), 'min-h-36 py-3 leading-relaxed')}
        />
        <p className="mt-1.5 text-right text-xs text-muted" aria-hidden>
          {values.description.trim().length} / 4000
        </p>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="inquiry-budget" label="Budget range" optional error={errors.budget}>
          <select
            id="inquiry-budget"
            name="budget"
            value={values.budget}
            onChange={update('budget')}
            aria-invalid={!!errors.budget}
            className={cn(controlClass(!!errors.budget), 'h-12')}
          >
            <option value="">Prefer not to say</option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="inquiry-timeline" label="Timeline" optional error={errors.timeline}>
          <select
            id="inquiry-timeline"
            name="timeline"
            value={values.timeline}
            onChange={update('timeline')}
            aria-invalid={!!errors.timeline}
            className={cn(controlClass(!!errors.timeline), 'h-12')}
          >
            <option value="">No fixed timeline</option>
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="inquiry-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={update('consent')}
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy('inquiry-consent', { error: !!errors.consent })}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line accent-blue"
          />
          <label htmlFor="inquiry-consent" className="text-sm leading-relaxed text-ink">
            I agree that Visa2Grow may use these details to respond to my inquiry, as described in the{' '}
            <Link to="/privacy" className="font-semibold text-blue underline underline-offset-2">
              privacy notice
            </Link>
            .
          </label>
        </div>
        {errors.consent && (
          <p id="inquiry-consent-error" className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      {status === 'error' && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-lg border border-danger/30 bg-[#fdf2f3] p-4 focus:outline-none">
          <p className="font-semibold text-danger">Your inquiry was not sent.</p>
          <p className="mt-1 text-sm text-ink">
            {errorMessage} Your details are still here. Please try again
            {contactEmail ? (
              <>
                , or{' '}
                <a href={mailtoHref(contactEmail, values)} className="font-semibold text-blue underline">
                  send it by email instead
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      )}

      {status === 'unconfigured' && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 focus:outline-none">
          <p className="font-semibold">Online submission isn’t connected yet, so your inquiry was not sent.</p>
          {contactEmail ? (
            <p className="mt-2 text-sm">
              <a href={mailtoHref(contactEmail, values)} className="inline-flex items-center gap-1.5 font-semibold text-blue underline">
                <Mail aria-hidden className="size-4" /> Send your inquiry by email
              </a>{' '}
              (it opens your email app with your details filled in).
            </p>
          ) : (
            <p className="mt-2 text-sm">Please check back soon. Nothing you entered has been shared.</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting} className="sm:min-w-52">
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="size-4.5 animate-spin" />
              Sending…
            </>
          ) : (
            'Send Project Inquiry'
          )}
        </Button>
        <p className="text-sm text-muted" aria-live="polite">
          {submitting ? 'Sending your inquiry…' : 'We’ll reply by email.'}
        </p>
      </div>
    </form>
  );
}
