/**
 * Vercel serverless function: POST /api/inquiry
 *
 * Server-side environment variables (set in Vercel → Project → Settings →
 * Environment Variables; never prefix them with VITE_):
 *   RESEND_API_KEY, INQUIRY_NOTIFICATION_EMAIL, INQUIRY_FROM_EMAIL
 * Optional: SITE_URL, INQUIRY_ALLOWED_ORIGINS (comma-separated).
 */
import { configFromEnv, handleInquiry } from '../server/inquiry';

const handler = (request: Request): Promise<Response> => handleInquiry(request, { config: configFromEnv(process.env) });

export const POST = handler;
export const OPTIONS = handler;
export const GET = handler; // answers 405 with an Allow header
