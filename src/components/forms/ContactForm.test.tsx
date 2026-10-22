import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ContactForm } from './ContactForm';
import type { SubmitResult } from '@/lib/contact';

function setup(result: SubmitResult | Promise<SubmitResult> = { status: 'sent' }, props: { contactEmail?: string; initialService?: string } = {}) {
  const submit = vi.fn(async (_data: unknown, _meta: unknown) => result);
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <ContactForm submit={submit} contactEmail={props.contactEmail ?? ''} initialService={props.initialService} />
    </MemoryRouter>,
  );
  return { submit, user };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Asha Rao');
  await user.type(screen.getByLabelText('Business email'), 'asha@example.com');
  await user.selectOptions(screen.getByLabelText('Service'), 'web-development');
  await user.type(
    screen.getByLabelText(/project description/i),
    'We need a customer portal for booking and paying for maintenance visits.',
  );
  await user.click(screen.getByRole('checkbox'));
}

describe('ContactForm', () => {
  it('shows accessible errors for every required field and focuses the first one', async () => {
    const { submit, user } = setup();
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));

    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Please fix 5 fields below.');
    const name = screen.getByLabelText('Name');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Please enter your name.');
    expect(screen.getByLabelText('Business email')).toHaveAccessibleDescription(/valid email/i);
    expect(screen.getByLabelText('Service')).toHaveAccessibleDescription(/choose the service/i);
    expect(screen.getByLabelText(/project description/i)).toHaveAccessibleDescription(/at least 30 characters/i);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(/please confirm/i);
  });

  it('rejects an invalid email and clears errors as fields are fixed', async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Business email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));
    expect(screen.getByLabelText('Business email')).toHaveAttribute('aria-invalid', 'true');

    await user.clear(screen.getByLabelText('Business email'));
    await user.type(screen.getByLabelText('Business email'), 'me@company.com');
    expect(screen.getByLabelText('Business email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('submits valid data and shows success only after the endpoint confirms', async () => {
    let resolve!: (r: SubmitResult) => void;
    const pending = new Promise<SubmitResult>((r) => (resolve = r));
    const { submit, user } = setup(pending);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    expect(screen.queryByText(/your inquiry was sent/i)).not.toBeInTheDocument();
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Asha Rao', email: 'asha@example.com', service: 'web-development', budget: '' }),
      expect.objectContaining({ submissionId: expect.any(String), website: '' }),
    );
    expect(submit.mock.calls[0]![0]).not.toHaveProperty('consent');

    resolve({ status: 'sent' });
    expect(await screen.findByText(/your inquiry was sent/i)).toBeInTheDocument();
  });

  it('keeps the data and explains the failure when sending fails', async () => {
    const { user } = setup({ status: 'error', message: 'The request timed out.' }, { contactEmail: 'hello@example.com' });
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));

    expect(await screen.findByText('Your inquiry was not sent.')).toBeInTheDocument();
    expect(screen.getByText(/the request timed out/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Asha Rao');
    expect(screen.getByRole('link', { name: /send it by email instead/i }).getAttribute('href')).toMatch(/^mailto:hello@example\.com\?/);
    expect(screen.queryByText(/your inquiry was sent/i)).not.toBeInTheDocument();
  });

  it('says plainly when online submission is not configured', async () => {
    const { user } = setup({ status: 'unconfigured' });
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));
    expect(await screen.findByText(/online submission isn’t connected yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/your inquiry was sent/i)).not.toBeInTheDocument();
  });

  it('blocks duplicate submits while a request is in progress, and reuses the id on retry', async () => {
    let resolve!: (r: SubmitResult) => void;
    const submit = vi.fn(() => new Promise<SubmitResult>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ContactForm submit={submit} contactEmail="" />
      </MemoryRouter>,
    );
    await fillValid(user);
    const button = screen.getByRole('button', { name: /send project inquiry/i });
    await user.click(button);
    await user.click(screen.getByRole('button', { name: /sending/i }));
    expect(submit).toHaveBeenCalledTimes(1);
    resolve({ status: 'error', message: 'Temporary problem.' });
    expect(await screen.findByText('Your inquiry was not sent.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));
    expect(submit).toHaveBeenCalledTimes(2);
    const ids = submit.mock.calls.map((c) => (c as unknown as [unknown, { submissionId: string }])[1].submissionId);
    expect(ids[0]).toBe(ids[1]);
  });

  it('shows field errors returned by the server', async () => {
    const { user } = setup({ status: 'invalid', fieldErrors: { email: 'That domain does not accept email.' } });
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send project inquiry/i }));
    expect(await screen.findByText('That domain does not accept email.')).toBeInTheDocument();
    expect(screen.getByLabelText('Business email')).toHaveFocus();
    expect(screen.queryByText(/your inquiry was sent/i)).not.toBeInTheDocument();
  });

  it('pre-selects a service passed from a service page', async () => {
    setup(undefined, { initialService: 'ai-automation' });
    expect(await screen.findByLabelText('Service')).toHaveValue('ai-automation');
  });

  it('ignores an unknown pre-selected service', () => {
    setup(undefined, { initialService: 'bogus' });
    expect(screen.getByLabelText('Service')).toHaveValue('');
  });
});
