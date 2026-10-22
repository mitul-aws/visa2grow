/** Entry for local servers (Vite dev route and scripts/serve.mjs). Not deployed. */
export { handleInquiry, configFromEnv, ProviderError, RateLimiter, type SendEmail } from './inquiry';
export { nodeToWebRequest, sendWebResponse } from './node-adapter';
