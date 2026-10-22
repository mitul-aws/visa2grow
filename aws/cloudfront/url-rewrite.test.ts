// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const code = readFileSync('aws/cloudfront/url-rewrite.js', 'utf8');
type Result = { uri?: string; statusCode?: number; headers?: Record<string, { value: string }> };
// CloudFront Functions are plain scripts; evaluate one the same way, with the
// CloudFormation !Sub placeholder filled in.
const load = (canonical: string) =>
  new Function(`${code.replace('${CanonicalHost}', canonical)}\nreturn handler;`)() as (e: unknown) => Result;
const handler = load('visa2grow.com');

const run = (uri: string, host = 'visa2grow.com', querystring: Record<string, unknown> = {}, h = handler) =>
  h({ request: { uri, headers: { host: { value: host } }, querystring } });

describe('CloudFront url-rewrite function', () => {
  it.each([
    ['/', '/index.html'],
    ['/about', '/about.html'],
    ['/services/web-development', '/services/web-development.html'],
    ['/assets/index-abc123.js', '/assets/index-abc123.js'],
    ['/brand/og-image.png', '/brand/og-image.png'],
    ['/sitemap.xml', '/sitemap.xml'],
    ['/404.html', '/404.html'],
  ])('serves %s from %s', (uri, expected) => {
    expect(run(uri).uri).toBe(expected);
  });

  it.each([
    ['/about/', '/about'],
    ['/services/', '/services'],
    ['/about.html', '/about'],
    ['/index.html', '/'],
  ])('redirects %s to %s', (uri, location) => {
    const res = run(uri);
    expect(res.statusCode).toBe(301);
    expect(res.headers!.location!.value).toBe(location);
  });

  it('leaves the *.cloudfront.net address alone so the site can be tested before DNS', () => {
    expect(run('/about', 'd111abcdef8.cloudfront.net').uri).toBe('/about.html');
  });

  it('supports www as the canonical host (for DNS that cannot point the apex)', () => {
    const wwwFirst = load('www.visa2grow.com');
    const res = run('/about', 'visa2grow.com', {}, wwwFirst);
    expect(res.headers!.location!.value).toBe('https://www.visa2grow.com/about');
    expect(run('/about', 'www.visa2grow.com', {}, wwwFirst).uri).toBe('/about.html');
  });

  it('does no host redirect when no canonical host is configured', () => {
    expect(run('/about', 'www.visa2grow.com', {}, load('')).uri).toBe('/about.html');
  });

  it('contains no ${...} other than the CloudFormation placeholder', () => {
    expect(code.match(/\$\{[^}]*\}/g)).toEqual(['${CanonicalHost}']);
  });

  it('redirects www to the bare domain, keeping path and query', () => {
    const res = run('/contact', 'www.visa2grow.com', { service: { value: 'code-audit' } });
    expect(res.statusCode).toBe(301);
    expect(res.headers!.location!.value).toBe('https://visa2grow.com/contact?service=code-audit');
  });

  it('keeps multi-value and empty query parameters on redirects', () => {
    const res = run('/portfolio/', 'visa2grow.com', { a: { value: '1', multiValue: [{ value: '1' }, { value: '2' }] }, flag: { value: '' } });
    expect(res.headers!.location!.value).toBe('/portfolio?a=1&a=2&flag');
  });

  it('is embedded verbatim in the CloudFormation template', () => {
    const template = readFileSync('aws/cloudformation.yml', 'utf8');
    const start = template.indexOf('// BEGIN url-rewrite');
    const end = template.indexOf('// END url-rewrite') + '// END url-rewrite'.length;
    expect(start).toBeGreaterThan(-1);
    const embedded = template
      .slice(start, end)
      .split('\n')
      .map((l) => l.replace(/^ {10}/, ''))
      .join('\n');
    expect(embedded.trim()).toBe(code.trim());
  });
});
