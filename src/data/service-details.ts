import type { ServiceDetail } from '@/types/content';

/** Long-form service page content, keyed by service slug. */
export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'web-development': {
    headline: 'Web application development with React and TypeScript',
    intro:
      'From a first MVP to a mature product that needs a cleaner foundation, we build web applications that load quickly, work for every user and stay easy to change. Type-safe code, tested components and a deployment pipeline come as standard, not as extras.',
    problems: [
      {
        title: 'The front-end has become hard to change',
        description:
          'Small features take weeks because components are tangled, untyped or duplicated. We restructure incrementally so delivery speeds up without a risky rewrite.',
      },
      {
        title: 'Pages feel slow and visitors leave',
        description:
          'Heavy bundles, layout shifts and unoptimised images hurt conversion and search visibility. We measure first, then fix what actually moves Core Web Vitals.',
      },
      {
        title: 'You need an MVP without throwaway code',
        description:
          'A first release should be quick, but it should also be something you can keep building on. We scope tightly and build the core properly.',
      },
      {
        title: 'Search engines cannot see your React content',
        description:
          'Client-only rendering can leave crawlers with an empty page. We choose the right rendering strategy (prerendering, SSR or a hybrid) for each route.',
      },
    ],
    capabilities: [
      { title: 'Web applications & SaaS products', description: 'Authenticated apps, multi-step flows, role-based views and real-time interfaces.' },
      { title: 'MVP development', description: 'A focused first release that validates the idea and remains maintainable afterwards.' },
      { title: 'Dashboards & internal tools', description: 'Data-heavy interfaces with tables, filters and charts that stay responsive with real data volumes.' },
      { title: 'Design systems & component libraries', description: 'Reusable, typed, documented components that keep a growing product consistent.' },
      { title: 'Performance & accessibility', description: 'Audits and fixes against Core Web Vitals and WCAG 2.2 AA, verified with measurement.' },
      { title: 'Modernisation', description: 'Incremental migration from legacy JavaScript, jQuery or older frameworks to typed React.' },
    ],
    deliverables: [
      'Source code in your repository, typed with strict TypeScript',
      'Reusable component library aligned with your design',
      'Automated unit and end-to-end tests for critical journeys',
      'CI pipeline that checks types, tests and builds on every change',
      'Deployment to your hosting, with environment documentation',
      'Handover notes covering architecture and how to extend it',
    ],
    technologies: [
      { group: 'Frameworks', items: ['React', 'Next.js', 'Vite', 'React Router'] },
      { group: 'Language & styling', items: ['TypeScript', 'Tailwind CSS', 'CSS Modules'] },
      { group: 'Data', items: ['TanStack Query', 'REST', 'GraphQL'] },
      { group: 'Quality', items: ['Vitest', 'Testing Library', 'Playwright', 'Lighthouse'] },
    ],
    workflow: [
      { title: 'Audit or discovery', description: 'Review the existing code or map the product idea, users and must-have flows.' },
      { title: 'Architecture & scope', description: 'Agree on rendering strategy, component structure, milestones and an estimate range.' },
      { title: 'Iterative build', description: 'Weekly increments on a preview URL so you can click through real progress.' },
      { title: 'Hardening & launch', description: 'Accessibility, performance and cross-browser checks, then a monitored release.' },
    ],
    aiNote:
      'AI tools speed up component scaffolding, test writing, refactoring and documentation. Architecture, state management decisions, accessibility and every merged change are reviewed by an experienced engineer.',
    faqs: [
      {
        question: 'Should my project use Next.js or a Vite single-page app?',
        answer:
          'It depends on how much of the product needs to be found through search. Logged-in applications usually work well as a Vite SPA. Public, content-heavy pages benefit from server rendering or prerendering. Many products combine both, and we will recommend one with the trade-offs written down.',
      },
      {
        question: 'Can you work on our existing codebase?',
        answer:
          'Yes. We start with a short code review to understand conventions and risks, then work within your structure rather than imposing a new one. Larger changes are proposed and agreed before they happen.',
      },
      {
        question: 'How do you make React sites SEO-friendly?',
        answer:
          'By making sure each indexable page ships real HTML content, unique metadata, structured data where it is factual, a sitemap and clean internal links, and by keeping performance strong. Client-side meta tags alone are not enough.',
      },
      {
        question: 'Do you only build new products?',
        answer:
          'No. Performance work, accessibility fixes, migrations and adding features to an existing app are all common engagements.',
      },
    ],
    related: ['ui-ux-design', 'backend-api-development', 'cloud-devops-qa'],
  
  },
  'mobile-app-development': {
    headline: 'Cross-platform mobile app development for iOS and Android',
    intro:
      'We build cross-platform mobile apps with React Native and Expo, so one team and one codebase can serve both iOS and Android. The focus is on the details users notice: fast start-up, fluid gestures, sensible offline behaviour and a release process that does not stall at app store review.',
    problems: [
      {
        title: 'Two native apps would double the cost',
        description:
          'Maintaining separate Swift and Kotlin codebases is expensive for an early product. A shared React Native codebase keeps one team moving on both platforms.',
      },
      {
        title: 'Your app feels janky or drains the battery',
        description:
          'Dropped frames, slow lists and excessive re-renders make an app feel cheap. We profile and fix the actual hot paths.',
      },
      {
        title: 'Users lose work when the connection drops',
        description:
          'Field teams and commuters need apps that keep working offline and sync safely later. That has to be designed in, not bolted on.',
      },
      {
        title: 'Store submissions keep getting stuck',
        description:
          'Signing, build configuration, privacy declarations and review guidelines slow down many first launches. We set up a repeatable release pipeline.',
      },
    ],
    capabilities: [
      { title: 'Cross-platform apps', description: 'One TypeScript codebase for iOS and Android, with native modules where a platform feature needs them.' },
      { title: 'Mobile MVPs', description: 'A store-ready first version covering the core journey, built to be extended.' },
      { title: 'Offline-first data', description: 'Local storage, background sync and conflict handling for unreliable networks.' },
      { title: 'Animations & gestures', description: 'Fluid, native-feeling interactions that run on the UI thread.' },
      { title: 'Release engineering', description: 'Build pipelines, over-the-air updates and store submission for Google Play and the App Store.' },
      { title: 'Monetisation & analytics', description: 'In-app purchases, subscriptions, ads and privacy-respecting analytics, integrated correctly.' },
    ],
    deliverables: [
      'iOS and Android builds from a shared TypeScript codebase',
      'Store listing assets checklist and submission support',
      'Automated build and release pipeline',
      'Crash reporting and basic analytics wiring',
      'Tests for business logic and key flows',
      'Documentation for building, releasing and updating the app',
    ],
    technologies: [
      { group: 'Core', items: ['React Native', 'Expo', 'TypeScript'] },
      { group: 'Interaction', items: ['Reanimated', 'Gesture Handler', 'Expo Router'] },
      { group: 'Data & storage', items: ['SQLite', 'MMKV', 'REST', 'GraphQL'] },
      { group: 'Release & quality', items: ['EAS Build', 'Jest', 'Google Play Console', 'App Store Connect'] },
    ],
    workflow: [
      { title: 'Product mapping', description: 'Define the core user journey, platform requirements and what the first release must include.' },
      { title: 'Prototype', description: 'Clickable flows and a technical spike for any risky native capability.' },
      { title: 'Build in increments', description: 'Regular test builds you can install on your own devices and give feedback on.' },
      { title: 'Store release', description: 'Store assets, privacy declarations, staged rollout and post-launch fixes.' },
    ],
    aiNote:
      'AI assistance helps with screen scaffolding, test generation and repetitive platform configuration. Performance profiling, native integration decisions and on-device verification are done by engineers.',
    faqs: [
      {
        question: 'Is React Native good enough compared with fully native apps?',
        answer:
          'For most business and consumer apps, yes. It renders real native components and can call native code when needed. If your product depends on heavy 3D, advanced camera processing or very specific platform APIs, we will say so and discuss native modules or a native build.',
      },
      {
        question: 'Can you help publish the app to the stores?',
        answer:
          'Yes. We prepare builds, help with listing content, privacy and data-safety declarations, and handle review feedback. The developer accounts should be owned by your business.',
      },
      {
        question: 'Can the app share code with our website?',
        answer:
          'Business logic, validation and API clients written in TypeScript can often be shared. User interface code usually differs between web and mobile, and we design the split deliberately.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'Apps need regular updates for new OS versions, store policy changes and user feedback. We can agree an ongoing maintenance arrangement or hand over with documentation.',
      },
    ],
    related: ['ui-ux-design', 'backend-api-development', 'cloud-devops-qa'],
  
  },
  'ai-automation': {
    headline: 'AI development and workflow automation that solves real problems',
    intro:
      'AI is useful when it is pointed at a specific, measurable problem. We help you find those problems, prototype quickly, evaluate honestly and then build AI features and automations that are reliable enough for daily use, with sensible handling of cost, privacy and failure cases.',
    problems: [
      {
        title: 'Your team repeats the same manual steps every day',
        description:
          'Copying data between systems, triaging emails or preparing reports can often be automated, with a person approving the steps that matter.',
      },
      {
        title: 'Knowledge is buried in documents',
        description:
          'Policies, manuals and past tickets hold answers nobody can find quickly. Retrieval-augmented assistants can surface them with links to the source.',
      },
      {
        title: 'You are not sure where AI would actually help',
        description:
          'Instead of a large commitment, we run a short discovery and a prototype against your real data to see whether the value is there.',
      },
      {
        title: 'Prototypes work in demos but not in production',
        description:
          'Production AI needs evaluation sets, monitoring, fallbacks, cost limits and clear handling of wrong answers. We build those in from the start.',
      },
    ],
    capabilities: [
      { title: 'AI-powered product features', description: 'Summarisation, classification, drafting and conversational interfaces inside your product.' },
      { title: 'Document & knowledge assistants', description: 'Retrieval-augmented generation over your documents, with citations back to sources.' },
      { title: 'Data extraction', description: 'Turning invoices, forms and unstructured text into structured, validated data.' },
      { title: 'Workflow automation', description: 'Connecting tools and APIs so routine work runs automatically, with human approval where needed.' },
      { title: 'Evaluation & guardrails', description: 'Test sets, quality metrics, output validation and safe fallbacks.' },
      { title: 'AI feasibility prototypes', description: 'A short, time-boxed build to answer “is this worth doing?” with evidence.' },
    ],
    deliverables: [
      'Problem definition with success criteria agreed up front',
      'Working prototype or production feature, depending on scope',
      'Evaluation set and results, including known failure cases',
      'Cost estimate per request and controls to cap it',
      'Data-handling notes covering what is sent to which provider',
      'Monitoring and a documented process for improving quality',
    ],
    technologies: [
      { group: 'Models & APIs', items: ['Hosted LLM APIs', 'Open-weight models', 'Embeddings'] },
      { group: 'Retrieval', items: ['Vector search', 'PostgreSQL + pgvector', 'Hybrid search'] },
      { group: 'Engineering', items: ['Python', 'TypeScript', 'Node.js', 'Structured outputs'] },
      { group: 'Automation', items: ['Webhooks', 'Queues', 'Scheduled jobs', 'Third-party APIs'] },
    ],
    workflow: [
      { title: 'Use-case discovery', description: 'Identify tasks where AI could help and agree how success will be measured.' },
      { title: 'Prototype & evaluate', description: 'Build against representative data and measure quality, latency and cost.' },
      { title: 'Productionise', description: 'Add guardrails, monitoring, access control and fallbacks; integrate into your systems.' },
      { title: 'Review & improve', description: 'Track real-world quality and refine prompts, retrieval or models over time.' },
    ],
    aiNote:
      'Every AI feature we ship has a human-defined purpose, an evaluation set and a plan for when the model is wrong. We will tell you when a simpler, non-AI solution would serve you better.',
    faqs: [
      {
        question: 'Will AI replace people on my team?',
        answer:
          'That is not how we approach it. The most dependable results come from automating repetitive steps and giving people better tools, while keeping humans responsible for judgement and approvals.',
      },
      {
        question: 'Is our data safe if we use AI models?',
        answer:
          'We design for data minimisation: only what is needed is sent, sensitive fields can be masked, and provider data-retention terms are reviewed with you. Where data cannot leave your environment, self-hosted open-weight models are an option.',
      },
      {
        question: 'How do you know if an AI feature is good enough?',
        answer:
          'We agree on a representative evaluation set and quality criteria before building, then measure against them. Results, including failure cases, are shared with you rather than summarised as a single impressive number.',
      },
      {
        question: 'Which AI provider do you use?',
        answer:
          'We choose per project based on quality, cost, latency and data requirements, and keep the integration portable where practical. We have no commercial partnership with any AI provider.',
      },
    ],
    related: ['backend-api-development', 'web-development', 'cloud-devops-qa'],
  
  },
  'backend-api-development': {
    headline: 'Backend and API development for reliable, scalable products',
    intro:
      'The backend is where most long-term cost hides. We design APIs and data models that are clear, secure and well-tested, integrate the third-party services your business depends on, and make the system observable so problems are found before your users report them.',
    problems: [
      {
        title: 'Integrations break silently',
        description:
          'Payments, CRMs and email providers fail in subtle ways. We build integrations with retries, idempotency and alerts so failures are visible and recoverable.',
      },
      {
        title: 'The data model no longer fits the business',
        description:
          'Workarounds pile up when the schema does not reflect how the business really works. We plan migrations that keep data safe and downtime minimal.',
      },
      {
        title: 'Nobody is sure the API is secure',
        description:
          'Authentication, authorisation and input validation need deliberate design. We review and harden them against common vulnerability classes.',
      },
      {
        title: 'Performance degrades as usage grows',
        description:
          'Slow queries and chatty endpoints get worse with scale. We find bottlenecks with measurement and fix them at the right layer.',
      },
    ],
    capabilities: [
      { title: 'REST & GraphQL APIs', description: 'Well-documented, versioned APIs with validation at the boundary and consistent error handling.' },
      { title: 'Data modelling', description: 'Relational schemas, migrations and indexing strategies designed around real access patterns.' },
      { title: 'Authentication & authorisation', description: 'Sessions, tokens, SSO and role-based access implemented carefully.' },
      { title: 'Third-party integrations', description: 'Payments, email, CRM, storage and webhook-driven systems with robust failure handling.' },
      { title: 'Background processing', description: 'Queues, scheduled jobs and event-driven workflows for work that should not block a request.' },
      { title: 'Observability', description: 'Structured logs, metrics, tracing and alerts that make production behaviour understandable.' },
    ],
    deliverables: [
      'API with an OpenAPI or GraphQL schema as the contract',
      'Database schema and repeatable migrations',
      'Automated tests for business rules and endpoints',
      'Security review notes and fixes applied',
      'Logging, monitoring and alerting setup',
      'Runbook covering deployment, configuration and common issues',
    ],
    technologies: [
      { group: 'Runtime & language', items: ['Node.js', 'TypeScript', 'Python'] },
      { group: 'Frameworks', items: ['Express', 'Fastify', 'NestJS', 'FastAPI'] },
      { group: 'Data', items: ['PostgreSQL', 'Redis', 'Prisma', 'Drizzle'] },
      { group: 'Interfaces', items: ['REST', 'GraphQL', 'Webhooks', 'OpenAPI'] },
    ],
    workflow: [
      { title: 'Domain & contract', description: 'Model the business rules and agree the API contract before implementation.' },
      { title: 'Foundation', description: 'Project structure, auth, data layer, CI and environments set up early.' },
      { title: 'Feature delivery', description: 'Endpoints and integrations delivered with tests and documentation alongside.' },
      { title: 'Load & security checks', description: 'Verify behaviour under realistic load and review security before go-live.' },
    ],
    aiNote:
      'AI helps draft boilerplate, test cases, migrations and API documentation. Data modelling, security decisions and anything touching money or personal data get careful human design and review.',
    faqs: [
      {
        question: 'REST or GraphQL?',
        answer:
          'REST is simpler to cache and operate and suits most public or integration APIs. GraphQL helps when many clients need different shapes of related data. We will recommend based on your clients and team.',
      },
      {
        question: 'Can you take over an existing backend?',
        answer:
          'Yes. We begin with a review of the architecture, data and deployment so we understand the risks, then propose a plan that prioritises stability.',
      },
      {
        question: 'Where will the backend be hosted?',
        answer:
          'Wherever suits your needs and budget: managed platforms, containers on a cloud provider or serverless functions. Accounts and infrastructure should be owned by your business.',
      },
      {
        question: 'How do you handle sensitive data?',
        answer:
          'With least-privilege access, encryption in transit and at rest where supported, input validation, secrets kept out of code and logs that avoid personal data. Specific compliance requirements are scoped explicitly.',
      },
    ],
    related: ['web-development', 'ai-automation', 'cloud-devops-qa'],
  
  },
  'ui-ux-design': {
    headline: 'UI/UX and product design that turns ideas into usable products',
    intro:
      'Good design reduces development cost because it settles questions before code is written. We map user journeys, prototype the critical flows, and produce interface designs and design systems that engineers can implement faithfully, with accessibility considered from the first wireframe.',
    problems: [
      {
        title: 'Users get lost or drop off',
        description:
          'Confusing navigation and unclear next steps cost conversions. We trace where people struggle and redesign those moments.',
      },
      {
        title: 'Designs and the built product never match',
        description:
          'When designs ignore technical constraints, developers improvise. We design with implementation in mind and specify states and edge cases.',
      },
      {
        title: 'Every screen looks slightly different',
        description:
          'Without shared components, products drift. A design system brings consistency and speeds up both design and development.',
      },
      {
        title: 'Accessibility is an afterthought',
        description:
          'Retrofitting accessibility is expensive. Contrast, focus order, target sizes and clear labels are part of our process from the start.',
      },
    ],
    capabilities: [
      { title: 'Product discovery', description: 'Clarify users, goals and the smallest valuable scope before design begins.' },
      { title: 'User flows & wireframes', description: 'Map the journeys that matter and test structure before visual polish.' },
      { title: 'Interactive prototypes', description: 'Clickable prototypes for stakeholder alignment and early user feedback.' },
      { title: 'Visual interface design', description: 'Polished, on-brand screens for web and mobile, including empty, loading and error states.' },
      { title: 'Design systems', description: 'Tokens, components and usage guidelines shared between design and code.' },
      { title: 'Accessibility & UX reviews', description: 'Heuristic and WCAG-oriented reviews of existing products with prioritised fixes.' },
    ],
    deliverables: [
      'User journey maps and annotated wireframes',
      'Interactive prototype of key flows',
      'High-fidelity designs with all component states',
      'Design tokens and component specifications',
      'Accessibility notes for each component',
      'Developer handover file organised for implementation',
    ],
    technologies: [
      { group: 'Design', items: ['Figma', 'FigJam', 'Variables & tokens'] },
      { group: 'Prototyping', items: ['Figma prototypes', 'Coded prototypes'] },
      { group: 'Accessibility', items: ['WCAG 2.2', 'Contrast tooling', 'Screen reader testing'] },
      { group: 'Handover', items: ['Design tokens', 'Storybook', 'Component specs'] },
    ],
    workflow: [
      { title: 'Understand', description: 'Goals, users, constraints and any existing research or analytics.' },
      { title: 'Structure', description: 'Information architecture, flows and low-fidelity wireframes.' },
      { title: 'Design & prototype', description: 'Visual design and interactive prototypes, refined through feedback rounds.' },
      { title: 'Handover & support', description: 'Specifications for developers and design support during the build.' },
    ],
    aiNote:
      'AI tools can speed up exploring layout variations, drafting UX copy and summarising feedback. Design decisions, brand judgement and accessibility checks remain with the designer.',
    faqs: [
      {
        question: 'Do you only design, or also build?',
        answer:
          'Both. Design can be a standalone engagement, but combining design and development avoids hand-off gaps because the same team owns the result.',
      },
      {
        question: 'We already have a brand. Will you follow it?',
        answer:
          'Yes. We work within existing brand guidelines and extend them into a product design system where they do not yet cover interface needs.',
      },
      {
        question: 'Do you run user testing?',
        answer:
          'We can run lightweight usability sessions with a small number of participants that you recruit or help us reach. For larger research programmes we will scope it separately.',
      },
      {
        question: 'What will we own at the end?',
        answer:
          'All design files, prototypes and specifications are handed over to you, in your own tool accounts where possible.',
      },
    ],
    related: ['web-development', 'mobile-app-development', 'ai-automation'],
  
  },
  'cloud-devops-qa': {
    headline: 'Cloud, DevOps and automated testing for confident releases',
    intro:
      'Shipping should be boring. We set up the pipelines, environments, infrastructure and test automation that let your team release small changes often, catch regressions before users do and recover quickly when something goes wrong.',
    problems: [
      {
        title: 'Releases are manual and stressful',
        description:
          'If deploying requires a checklist and a brave person, releases become rare and risky. Automated pipelines make them routine.',
      },
      {
        title: 'Bugs reach users before you notice',
        description:
          'Without automated tests and monitoring, users become your QA team. We add the tests and alerts that catch problems earlier.',
      },
      {
        title: 'Cloud costs keep creeping up',
        description:
          'Over-provisioned resources and forgotten services add up. We review usage and right-size infrastructure.',
      },
      {
        title: 'Environments drift apart',
        description:
          '“It works on staging” is a symptom of hand-configured servers. Infrastructure as code keeps environments reproducible.',
      },
    ],
    capabilities: [
      { title: 'CI/CD pipelines', description: 'Automated checks, builds, previews and deployments on every change.' },
      { title: 'Infrastructure as code', description: 'Reproducible environments defined in version-controlled configuration.' },
      { title: 'Containers & hosting', description: 'Docker-based deployments, managed platforms or serverless, chosen to fit the workload.' },
      { title: 'Automated testing', description: 'Unit, integration and end-to-end test suites focused on the journeys that matter.' },
      { title: 'Monitoring & alerting', description: 'Uptime checks, error tracking, metrics and alerts routed to the right people.' },
      { title: 'Cost & reliability reviews', description: 'Find waste, single points of failure and missing backups, then fix them.' },
    ],
    deliverables: [
      'CI/CD pipeline configured in your repository',
      'Infrastructure defined as code with environment documentation',
      'Automated test suite integrated into the pipeline',
      'Monitoring dashboards and alert routing',
      'Backup and recovery procedure, tested',
      'Release runbook for your team',
    ],
    technologies: [
      { group: 'CI/CD', items: ['GitHub Actions', 'GitLab CI'] },
      { group: 'Infrastructure', items: ['Docker', 'Terraform', 'AWS', 'Google Cloud', 'Azure'] },
      { group: 'Testing', items: ['Playwright', 'Vitest', 'Jest', 'k6'] },
      { group: 'Observability', items: ['OpenTelemetry', 'Error tracking', 'Uptime monitoring'] },
    ],
    workflow: [
      { title: 'Assess', description: 'Review the current release process, infrastructure, test coverage and incidents.' },
      { title: 'Prioritise', description: 'Agree the changes that reduce the most risk for the least effort.' },
      { title: 'Implement', description: 'Pipelines, infrastructure code and test suites introduced incrementally.' },
      { title: 'Hand over', description: 'Runbooks and a walkthrough so your team can operate it confidently.' },
    ],
    aiNote:
      'AI assistance is useful for generating test cases, pipeline configuration and documentation drafts. Access control, production changes and incident decisions are handled deliberately by engineers.',
    faqs: [
      {
        question: 'Which cloud provider should we use?',
        answer:
          'The one that fits your workload, team skills, budget and any data-residency needs. For many early products a managed platform is simpler than raw cloud infrastructure. Cloud providers are named here as technologies we work with, not partners.',
      },
      {
        question: 'How much test coverage do we need?',
        answer:
          'Coverage percentage matters less than covering the critical journeys and business rules. We prioritise tests that would catch the failures that would hurt you most.',
      },
      {
        question: 'Can you improve our existing pipeline instead of replacing it?',
        answer:
          'Usually, yes. We extend what works and only replace parts that are causing real problems.',
      },
      {
        question: 'Do you provide 24/7 on-call support?',
        answer:
          'Not at this stage. We set up monitoring and alerting so your team or a dedicated provider can respond, and can agree defined support hours for maintenance work.',
      },
    ],
    related: ['code-audit', 'backend-api-development', 'web-development'],
  },
  'code-audit': {
    headline: 'Code audits that show where your software really stands',
    intro:
      'Whether you inherited a codebase, delivery has slowed down, or you are about to invest in growth, an audit gives you an honest, independent picture of your system. We review the code, architecture, security, performance and infrastructure, then explain what we found in plain language with a prioritised plan of what to fix first.',
    problems: [
      {
        title: 'You inherited code from a previous vendor or developer',
        description:
          'Nobody on your side fully understands how it works or how risky it is to change. An audit maps the system and its weak spots before you commit to more work.',
      },
      {
        title: 'Every release brings new bugs',
        description:
          'Frequent regressions usually point to missing tests, tangled dependencies or unclear boundaries. We find the root causes rather than listing symptoms.',
      },
      {
        title: 'You are not sure the system can handle growth',
        description:
          'Before a marketing push or a large customer, it helps to know where the bottlenecks are: database queries, architecture, infrastructure or third-party limits.',
      },
      {
        title: 'Security is a question mark',
        description:
          'Outdated dependencies, exposed secrets and weak access control are common in fast-built products. We check for them systematically and rank them by real risk.',
      },
    ],
    capabilities: [
      { title: 'Code quality & maintainability', description: 'Structure, duplication, typing, readability and how easy the code is to change safely.' },
      { title: 'Architecture review', description: 'Boundaries, data flow, coupling and whether the design fits where the product is heading.' },
      { title: 'Security review', description: 'Authentication, authorisation, input handling, secrets, dependency vulnerabilities and common web/mobile risks.' },
      { title: 'Performance & scalability', description: 'Slow queries, heavy endpoints, front-end performance and the first things likely to break under load.' },
      { title: 'Infrastructure & delivery', description: 'Hosting, CI/CD, backups, monitoring and cloud costs, including single points of failure.' },
      { title: 'Testing & QA process', description: 'What is tested, what is not, and which missing tests carry the most risk.' },
    ],
    deliverables: [
      'Written report with every finding rated by severity and effort to fix',
      'Plain-language executive summary for non-technical stakeholders',
      'Prioritised roadmap: quick wins, next steps and longer-term work',
      'Walkthrough call to discuss findings and answer questions',
      'Evidence for each finding (file, example, how to reproduce)',
      'Optional: we fix the findings, or support your team while they do',
    ],
    technologies: [
      { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
      { group: 'Stacks we review', items: ['React', 'Next.js', 'React Native', 'Node.js', 'REST & GraphQL APIs'] },
      { group: 'Analysis tooling', items: ['Static analysis', 'Dependency scanners', 'Profilers', 'Lighthouse'] },
      { group: 'Infrastructure', items: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'CI/CD pipelines'] },
    ],
    workflow: [
      { title: 'Scope & access', description: 'Agree what is in scope and get read-only repository access, under NDA if you need one.' },
      { title: 'Automated analysis', description: 'Static analysis, dependency and security scanners, plus AI-assisted review to map a large codebase quickly.' },
      { title: 'Expert review', description: 'An engineer reads the critical paths, architecture and data handling, and verifies every finding.' },
      { title: 'Report & roadmap', description: 'A prioritised written report and a walkthrough session with your team.' },
    ],
    aiNote:
      'AI tools help us read a large codebase quickly: summarising modules, tracing data flow and flagging suspicious patterns. Nothing goes into the report until an engineer has verified it, and we only use AI tools on your code under terms you have approved.',
    faqs: [
      {
        question: 'How long does a code audit take?',
        answer:
          'It depends on the size of the system and the scope. We look at the codebase first, then agree the scope, timeline and price in writing before starting.',
      },
      {
        question: 'Do you need access to production?',
        answer:
          'Usually not. Read-only access to the repository and a description of the hosting setup are normally enough. If production access helps (for example, for performance data), it should be read-only and temporary.',
      },
      {
        question: 'Will you fix the problems you find?',
        answer:
          'If you want us to. The report stands on its own, so your team or another vendor can act on it. We can also fix the findings or work alongside your developers.',
      },
      {
        question: 'Is our code kept confidential?',
        answer:
          'Yes. We are happy to sign an NDA, we only use the access needed for the audit, and access is removed when it ends. If you prefer, we will not run your code through any third-party AI tools.',
      },
    ],
    related: ['scaling-consulting', 'backend-api-development', 'cloud-devops-qa'],
  },
  'scaling-consulting': {
    headline: 'Scaling consulting: technology that keeps up with your growth',
    intro:
      'Growth exposes weak points: manual processes that worked for ten customers fail at a thousand, systems slow down at peak times, and costs climb faster than revenue. We help you plan and build the technology side of scaling, with a roadmap tied to your business goals, an architecture that can grow and automation that removes bottlenecks.',
    problems: [
      {
        title: 'Manual work grows with every new customer',
        description:
          'Copying data, chasing approvals and assembling reports by hand limits how fast you can grow. We find the processes worth automating first.',
      },
      {
        title: 'Systems slow down or fail at busy times',
        description:
          'Peak traffic, large imports or month-end jobs reveal capacity limits. We identify them and plan fixes before they cost you customers.',
      },
      {
        title: 'Technology decisions happen ad hoc',
        description:
          'Without a roadmap, tools and features accumulate without a plan. We help you decide what to build, buy, replace or leave alone, and in what order.',
      },
      {
        title: 'Costs rise faster than revenue',
        description:
          'Cloud bills, overlapping software subscriptions and inefficient processes add up. We look for savings that do not compromise reliability.',
      },
    ],
    capabilities: [
      { title: 'Technology roadmap', description: 'A prioritised plan connecting business goals to systems, features and investment.' },
      { title: 'Scalable architecture planning', description: 'Changes that let your product handle more users, data and integrations, without unnecessary complexity.' },
      { title: 'Process & workflow automation', description: 'Identifying and automating repetitive work across your tools, with people approving what matters.' },
      { title: 'Cloud & tooling cost review', description: 'Right-sizing infrastructure and consolidating tools to match how you actually work.' },
      { title: 'Engineering practices for growing teams', description: 'Code review, release process, documentation and onboarding so a bigger team still ships quickly.' },
      { title: 'Ongoing technical advisory', description: 'Regular sessions to review decisions, vendors and progress as the business grows.' },
    ],
    deliverables: [
      'Current-state assessment of systems, processes and costs',
      'Prioritised roadmap with estimate ranges and assumptions',
      'Architecture recommendations with the trade-offs explained',
      'Shortlist of automation opportunities with expected effort',
      'Decision notes for build, buy or replace choices',
      'Optional implementation support through our other services',
    ],
    technologies: [
      { group: 'Architecture', items: ['Modular monoliths', 'Caching', 'Queues & background jobs', 'Event-driven integration'] },
      { group: 'Automation', items: ['Workflow automation', 'APIs & webhooks', 'AI-assisted automation'] },
      { group: 'Cloud', items: ['AWS', 'Google Cloud', 'Azure', 'Serverless', 'Managed databases'] },
      { group: 'Measurement', items: ['Monitoring', 'Product analytics', 'Service-level objectives'] },
    ],
    workflow: [
      { title: 'Understand the goals', description: 'Growth targets, constraints, budget and where things already feel stretched.' },
      { title: 'Assess', description: 'Review systems, processes, data and costs to find the real bottlenecks.' },
      { title: 'Roadmap', description: 'Agree priorities, sequencing and estimate ranges for the changes that matter most.' },
      { title: 'Implement & advise', description: 'Deliver the work with our team or yours, with regular check-ins on progress.' },
    ],
    aiNote:
      'AI helps us analyse process data, prototype automations quickly and draft documentation. Recommendations come from experienced engineers who understand your business context, and we will say so when AI is not the right answer.',
    faqs: [
      {
        question: 'Is this business consulting or technical consulting?',
        answer:
          'It focuses on the technology and operations side of growth: systems, automation, architecture, costs and engineering practices. We work alongside your business decisions rather than replacing sales or marketing strategy.',
      },
      {
        question: 'Do we need to be a technology company?',
        answer:
          'No. Many growing businesses run on a mix of off-the-shelf tools, spreadsheets and a few custom systems. That is often where automation and better integration help most.',
      },
      {
        question: 'Is this a one-off engagement or ongoing?',
        answer:
          'Either. Some clients want a roadmap they can act on themselves; others prefer regular advisory sessions while the work happens.',
      },
      {
        question: 'Should we start with a code audit?',
        answer:
          'If you already have custom software, an audit is often the best first step, because it shows what the current system can support and what needs work before you scale.',
      },
    ],
    related: ['code-audit', 'ai-automation', 'cloud-devops-qa'],
  },
};
