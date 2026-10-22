import type { ArticleBlock } from '@/types/content';

/** Article bodies keyed by slug. Loaded only with the article page. */
export const ARTICLE_BODIES: Record<string, ArticleBlock[]> = {
  'ai-assisted-development-what-it-speeds-up': [
      {
        type: 'p',
        text: 'AI coding assistants have changed the day-to-day work of building software. Used well, they remove a lot of repetitive effort. Used carelessly, they produce code that looks plausible, passes a quick glance and fails in production. The difference is rarely the tool. It is the process around it.',
      },
      {
        type: 'p',
        text: 'This article sets out how we think about AI in software delivery: which tasks it accelerates, which decisions it should not make, and how review keeps the output trustworthy.',
      },
      { type: 'h2', id: 'where-ai-helps', text: 'Where AI genuinely helps' },
      {
        type: 'p',
        text: 'The biggest gains come from work that is well-defined, easy to verify and tedious to do by hand:',
      },
      {
        type: 'ul',
        items: [
          'Scaffolding: creating the files, types and wiring for a new component, endpoint or screen that follows an existing pattern.',
          'Refactoring: renaming, extracting functions or converting code to a new API across many files, with tests to confirm nothing changed.',
          'Tests: drafting unit test cases from a clear specification, including edge cases a person might skip.',
          'Documentation: turning code and decisions into readable explanations, README sections and API docs.',
          'Prototypes: building a throwaway version quickly to test whether an idea is worth pursuing.',
          'Unfamiliar territory: explaining an unfamiliar library or legacy module before an engineer changes it.',
        ],
      },
      {
        type: 'p',
        text: 'In each of these, a person can check the result quickly and objectively. That property, cheap verification, is what makes AI assistance safe and productive.',
      },
      { type: 'h2', id: 'where-humans-lead', text: 'Where humans should stay in charge' },
      {
        type: 'p',
        text: 'Other work is hard to verify by reading the output, or has consequences that outlast the code:',
      },
      {
        type: 'ul',
        items: [
          'Architecture: how data flows, where boundaries sit and which trade-offs to accept shape the cost of every later change.',
          'Security: authentication, authorisation and handling of personal data need deliberate design and adversarial thinking.',
          'Data modelling: a schema mistake can be expensive to unwind once real data depends on it.',
          'Product judgement: deciding what not to build is often the most valuable decision in a project.',
          'Accountability: someone has to understand, and stand behind, every line that ships.',
        ],
      },
      {
        type: 'p',
        text: 'AI can contribute ideas to all of these, and it is often useful as a sounding board. But the decision, and the responsibility for it, belongs to an engineer who understands the context.',
      },
      { type: 'h2', id: 'review-practices', text: 'Review practices that keep quality high' },
      {
        type: 'ol',
        items: [
          'Treat AI output as a draft from a fast but inexperienced colleague. Read it, question it and run it.',
          'Keep changes small. A reviewable diff is one a person can actually understand in one sitting.',
          'Let the type checker, linters and tests do the first pass. Strict types catch a surprising share of AI mistakes.',
          'Write or confirm the tests yourself for business-critical logic, so the tests encode intent rather than repeat the implementation.',
          'Never paste secrets, credentials or customer data into tools that are not approved for it.',
          'Record significant decisions in plain language, so the reasoning survives beyond the chat that produced the code.',
        ],
      },
      { type: 'h2', id: 'what-it-means-for-clients', text: 'What this means for clients' },
      {
        type: 'p',
        text: 'AI assistance can reduce the time spent on routine work, which frees time for the parts of a project that need careful thought. It does not make every project a fixed number of times faster, and anyone promising that is guessing. The honest benefit is more engineering attention on the decisions that matter, with the routine work handled efficiently.',
      },
      {
        type: 'quote',
        text: 'AI-first, human-led: the tools draft, engineers decide, and tests verify.',
      },
      {
        type: 'p',
        text: 'If you are planning a project and want to understand how AI-assisted development would apply to it, we are happy to talk it through.',
      },
  ],
  'vite-or-nextjs-for-seo': [
      {
        type: 'p',
        text: 'React gives you a lot of freedom in how pages are rendered, and that choice has a direct effect on search visibility. The question is not which framework is best in general, but which rendering strategy fits each part of your product.',
      },
      { type: 'h2', id: 'the-core-issue', text: 'The core issue: what is in the first HTML response' },
      {
        type: 'p',
        text: 'A classic single-page application sends the same nearly empty HTML file for every URL, then builds the page in the browser with JavaScript. Some crawlers render JavaScript, but rendering can be delayed, and social media previews and many other tools never run it at all. If your titles, descriptions and content only appear after JavaScript runs, you are relying on every consumer to do that work.',
      },
      {
        type: 'p',
        text: 'The safest position is simple: every page you want indexed should return meaningful, unique HTML, including its title, meta description, canonical URL and main content, in the very first response.',
      },
      { type: 'h2', id: 'three-strategies', text: 'Three rendering strategies' },
      { type: 'h3', text: 'Client-side rendering (CSR)' },
      {
        type: 'p',
        text: 'The browser renders everything. This is ideal for applications behind a login, such as dashboards and internal tools, where search engines should not be indexing anything anyway. It is a poor fit for public marketing and content pages.',
      },
      { type: 'h3', text: 'Static prerendering (SSG)' },
      {
        type: 'p',
        text: 'Each route is rendered to HTML at build time, and React then takes over in the browser. This works with a plain Vite setup and is excellent for pages whose content changes when you deploy: service pages, about pages, articles. Hosting is cheap and fast because the output is just files.',
      },
      { type: 'h3', text: 'Server-side rendering (SSR)' },
      {
        type: 'p',
        text: 'HTML is generated on each request. You need this when content depends on the request or changes too often to rebuild, such as large catalogues, personalised pages or listings with live inventory. Frameworks like Next.js make this convenient, at the cost of running a server.',
      },
      { type: 'h2', id: 'decision-guide', text: 'A quick decision guide' },
      {
        type: 'ul',
        items: [
          'Mostly an app behind login, with a few public pages: Vite SPA for the app, with prerendered public pages.',
          'Marketing site or blog with content that changes on deploy: static prerendering, with Vite or a framework.',
          'Thousands of pages from a database, or content that changes hourly: server rendering or incremental regeneration.',
          'Mixed product: split by route. Not every page needs the same strategy.',
        ],
      },
      { type: 'h2', id: 'beyond-rendering', text: 'Rendering is necessary, not sufficient' },
      {
        type: 'p',
        text: 'Getting HTML to crawlers is the foundation. The rest of technical SEO still applies:',
      },
      {
        type: 'ul',
        items: [
          'A unique title and description for every page, written for people rather than keyword lists.',
          'Canonical URLs, a sitemap and a robots.txt that does not block what you want indexed.',
          'Structured data that describes facts accurately, with no invented ratings or reviews.',
          'Clean internal links using real anchor elements, so crawlers can follow them.',
          'Good performance, especially on mobile: small bundles, optimised images and stable layouts.',
        ],
      },
      {
        type: 'p',
        text: 'This website is itself a Vite and React application with build-time prerendering for every public route, which is a good example of the approach working without changing frameworks.',
      },
  ],
  'scoping-an-mvp': [
      {
        type: 'p',
        text: 'Most product ideas arrive as a long list of features. Most first releases fail not because they were built badly, but because they tried to do too much and learned too little. Scoping a minimum viable product is the discipline of deciding what to leave out.',
      },
      { type: 'h2', id: 'start-with-the-assumption', text: 'Start with the riskiest assumption' },
      {
        type: 'p',
        text: 'Every product rests on assumptions: that a problem exists, that people will change their behaviour to solve it, that they will pay, that it can be built. Write them down, then ask which one, if wrong, would make the whole idea pointless. Your first release exists to test that assumption.',
      },
      { type: 'h2', id: 'one-journey', text: 'Design one complete journey' },
      {
        type: 'p',
        text: 'Pick the single path a user takes from arriving to getting value, and make that path work end to end. A complete, narrow journey teaches you more than ten half-finished features. Supporting features such as settings, admin panels and integrations can often be manual or minimal at first.',
      },
      { type: 'h2', id: 'sort-requirements', text: 'Sort requirements honestly' },
      {
        type: 'ol',
        items: [
          'Must have: without it, the core journey does not work or the assumption cannot be tested.',
          'Should have: valuable, but the first users can live without it for a few weeks.',
          'Later: everything else, written down so it is not lost, and deliberately not built yet.',
        ],
      },
      {
        type: 'p',
        text: 'A useful test for each feature: what would we learn by building it now that we could not learn later?',
      },
      { type: 'h2', id: 'minimum-not-throwaway', text: 'Minimum does not mean throwaway' },
      {
        type: 'p',
        text: 'An MVP should be small in scope, not low in quality. The parts you do build should be built properly: typed, tested where it matters, deployed through a pipeline and secure. Otherwise, a successful MVP becomes a liability exactly when it starts to grow.',
      },
      {
        type: 'ul',
        items: [
          'Choose boring, well-supported technology for the core.',
          'Keep the data model simple, but think about how it will grow.',
          'Automate deployment from the first week.',
          'Add analytics for the specific questions you need answered, and respect user privacy.',
        ],
      },
      { type: 'h2', id: 'estimates', text: 'Estimates as ranges, with assumptions' },
      {
        type: 'p',
        text: 'Early estimates are uncertain, and pretending otherwise causes trouble later. A range with written assumptions, such as “4 to 6 weeks, assuming the payment provider’s standard checkout and no custom admin panel”, is more useful than a single number, because it shows which decisions move the cost.',
      },
      { type: 'h2', id: 'after-launch', text: 'Plan what happens after launch' },
      {
        type: 'p',
        text: 'Decide before launch how you will judge the result: which signal would tell you to continue, change direction or stop. Then budget time for the iteration that will inevitably follow. The first release is the start of learning, not the end of the project.',
      },
      {
        type: 'p',
        text: 'If you have an idea and want help shaping it into a first release, get in touch and we can work through the scope together.',
      },
  ],
};

function blockText(block: ArticleBlock): string {
  if (block.type === 'ul' || block.type === 'ol') return block.items.join(' ');
  return block.text;
}

/** Reading time in minutes at ~220 words per minute. */
export function computeReadingMinutes(body: ArticleBlock[]): number {
  const words = body.map(blockText).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
