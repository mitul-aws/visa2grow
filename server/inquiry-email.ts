/**
 * Notification email for a new project inquiry: responsive HTML (inline
 * styles, table layout for email clients) plus a plain-text alternative.
 * Every visitor-supplied value is HTML-escaped before it reaches the markup.
 */
export interface InquiryEmailView {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
  submittedAt: Date;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes, then keeps the visitor's line breaks. */
const multiline = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br>');

export function formatTimestamp(date: Date): { utc: string; ist: string; iso: string } {
  const fmt = (timeZone: string) =>
    new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone,
    }).format(date);
  return { utc: `${fmt('UTC')} UTC`, ist: `${fmt('Asia/Kolkata')} IST`, iso: date.toISOString() };
}

const NOT_PROVIDED = 'Not provided';

export function renderInquiryEmail(v: InquiryEmailView): { html: string; text: string } {
  const time = formatTimestamp(v.submittedAt);
  const rows: Array<[string, string]> = [
    ['Name', v.name],
    ['Email', v.email],
    ['Company', v.company || NOT_PROVIDED],
    ['Service', v.service],
    ['Budget range', v.budget || NOT_PROVIDED],
    ['Expected timeline', v.timeline || NOT_PROVIDED],
    ['Submitted', `${time.utc} (${time.ist})`],
  ];

  const replyHref = `mailto:${encodeURIComponent(v.email).replace(/%40/g, '@')}?subject=${encodeURIComponent(`Re: your ${v.service} inquiry`)}`;

  const rowHtml = rows
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #E3E9F3;width:150px;vertical-align:top;font-size:13px;color:#52617A;font-weight:600">${escapeHtml(label)}</td>
            <td style="padding:10px 0;border-bottom:1px solid #E3E9F3;vertical-align:top;font-size:15px;color:#111827;word-break:break-word">${
              label === 'Email' ? `<a href="mailto:${escapeHtml(v.email)}" style="color:#2858F5">${escapeHtml(value)}</a>` : escapeHtml(value)
            }</td>
          </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>New project inquiry</title>
</head>
<body style="margin:0;padding:0;background:#F6F8FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(`${v.name} is asking about ${v.service}.`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FC;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E3E9F3;border-radius:14px;overflow:hidden">
        <tr><td style="height:4px;background:#2858F5;background-image:linear-gradient(90deg,#2858F5,#8546F8,#20C8F5)"></td></tr>
        <tr><td style="padding:28px 28px 8px">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#2858F5;font-weight:700">Visa2Grow · New project inquiry</p>
          <h1 style="margin:10px 0 4px;font-size:22px;line-height:1.3;color:#111827">${escapeHtml(v.name)} &middot; ${escapeHtml(v.service)}</h1>
          <p style="margin:0;font-size:14px;color:#52617A">Reply to this email to respond directly to ${escapeHtml(v.name)}.</p>
        </td></tr>
        <tr><td style="padding:12px 28px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}
          </table>
        </td></tr>
        <tr><td style="padding:22px 28px 0">
          <p style="margin:0 0 8px;font-size:13px;color:#52617A;font-weight:600">Project description</p>
          <div style="padding:16px;background:#F6F8FC;border:1px solid #E3E9F3;border-radius:10px;font-size:15px;line-height:1.6;color:#111827;word-break:break-word">${multiline(v.description)}</div>
        </td></tr>
        <tr><td style="padding:24px 28px 28px">
          <a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:12px 20px;background:#2858F5;color:#FFFFFF;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Reply to ${escapeHtml(v.name)}</a>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#F6F8FC;border-top:1px solid #E3E9F3;font-size:12px;color:#52617A">
          Sent by the project inquiry form on visa2grow.com &middot; Reference ${escapeHtml(v.id)} &middot; ${escapeHtml(time.iso)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    'NEW PROJECT INQUIRY — Visa2Grow',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Project description:',
    v.description,
    '',
    `Reply to this email to respond directly to ${v.name}.`,
    `Reference: ${v.id} · ${time.iso}`,
  ].join('\n');

  return { html, text };
}
