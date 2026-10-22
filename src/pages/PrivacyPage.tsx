import { Link } from 'react-router';
import { Seo } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { PAGE_SEO } from '@/data/seo';
import { SITE } from '@/lib/site';
import { formatDate } from '@/data/articles';
import { PageHero } from '@/components/sections/PageHero';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy', path: '/privacy' },
];

const UPDATED = '2026-10-22';

/*
 * Plain-language notice describing what this website actually does.
 * Have it reviewed for the jurisdictions you operate in before launch, and
 * update it if analytics, cookies or a different form provider are added.
 */
export default function PrivacyPage() {
  return (
    <>
      <Seo {...PAGE_SEO.privacy} jsonLd={[breadcrumbJsonLd(crumbs)]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Privacy"
        title="Privacy notice"
        description="How Visa2Grow handles the information you share through this website."
      />
      <div className="container-page max-w-3xl py-16">
        <div className="prose-v2g">
          <p className="text-sm text-muted">
            Last updated: <time dateTime={UPDATED}>{formatDate(UPDATED)}</time>
          </p>
          <h2>What we collect</h2>
          <p>
            When you submit the project inquiry form, we receive the details you enter: your name, email address, company
            (if provided), the service you are interested in, your project description, and any budget range or timeline you
            choose to share.
          </p>
          <p>
            This website does not set advertising or analytics cookies and does not use tracking scripts. Our hosting
            provider may keep standard server logs (such as IP address and request time) for security and reliability.
          </p>
          <h2>How we use it</h2>
          <ul>
            <li>To read and respond to your inquiry.</li>
            <li>To prepare a proposal if you ask us to.</li>
            <li>To keep a record of our correspondence if we go on to work together.</li>
          </ul>
          <p>We do not sell your information or use it for unrelated marketing.</p>
          <h2>Who processes it</h2>
          <p>
            When you submit the form, our website’s server checks it and sends it to our inbox as an email using Resend, an
            email delivery service. Our hosting provider runs that server, and our email provider stores the message. We
            only use providers that process data to deliver their service to us.
          </p>
          <h2>How long we keep it</h2>
          <p>
            We keep inquiry details for as long as needed to respond and, if we work together, for the duration of that
            relationship and any record-keeping obligations. You can ask us to delete your inquiry at any time.
          </p>
          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the information you sent us.{' '}
            {SITE.contactEmail ? (
              <>
                Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with your request.
              </>
            ) : (
              <>
                Contact us through the <Link to="/contact">contact page</Link> with your request.
              </>
            )}
          </p>
          <h2>Changes</h2>
          <p>If we change how we handle information, we will update this page and its date.</p>
        </div>
      </div>
    </>
  );
}
