import type { Service } from '@/types/content';

/**
 * Service summaries: used site-wide (nav, footer, cards, form options).
 * The long-form content for each service page lives in service-details.ts,
 * which is only loaded with the service page itself.
 */
export const SERVICES: Service[] = [
  {
    slug: 'web-development',
    name: 'Web Development',
    icon: 'globe',
    summary:
      'Fast, accessible web applications, dashboards and marketing sites built on React, TypeScript and a modern toolchain.',
    tags: ['React', 'TypeScript', 'Vite', 'Next.js'],
    seo: {
      title: 'React & Web Application Development',
      description:
        'React and TypeScript web development: MVPs, SaaS dashboards, internal tools and SEO-ready sites, built with AI-assisted, human-reviewed engineering.',
      serviceType: 'Web application development',
    },
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    icon: 'smartphone',
    summary:
      'iOS and Android apps from a single React Native codebase, built for smooth interactions, offline use and store-ready releases.',
    tags: ['React Native', 'Expo', 'TypeScript', 'iOS & Android'],
    seo: {
      title: 'Mobile App Development (iOS & Android)',
      description:
        'Cross-platform iOS and Android apps with React Native and Expo: MVPs, offline-first apps, store submission and ongoing releases.',
      serviceType: 'Mobile application development',
    },
  },
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    icon: 'brain',
    summary:
      'Practical AI features and automations: document assistants, intelligent search, data extraction and workflow automation with evaluation and guardrails.',
    tags: ['LLM APIs', 'RAG', 'Python', 'Automation'],
    seo: {
      title: 'AI Development & Workflow Automation',
      description:
        'AI development and automation: LLM features, document assistants, RAG, data extraction and workflow automation, built with evaluation and human oversight.',
      serviceType: 'Artificial intelligence development and automation',
    },
  },
  {
    slug: 'backend-api-development',
    name: 'Backend & API Development',
    icon: 'server',
    summary:
      'Secure APIs, data models and integrations with Node.js, TypeScript and PostgreSQL, designed to be observable and easy to evolve.',
    tags: ['Node.js', 'PostgreSQL', 'REST', 'GraphQL'],
    seo: {
      title: 'Backend & API Development',
      description:
        'Backend and API development with Node.js, TypeScript and PostgreSQL: REST and GraphQL APIs, authentication, third-party integrations and scalable data models.',
      serviceType: 'Backend and API development',
    },
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX & Product Design',
    icon: 'pen',
    summary:
      'User flows, wireframes, prototypes and design systems that make products clear to use and practical to build.',
    tags: ['Figma', 'Prototyping', 'Design systems', 'WCAG'],
    seo: {
      title: 'UI/UX & Product Design',
      description:
        'UI/UX and product design for web and mobile: user flows, wireframes, prototypes, design systems and accessibility reviews, ready for development.',
      serviceType: 'User interface and user experience design',
    },
  },
  {
    slug: 'cloud-devops-qa',
    name: 'Cloud, DevOps & QA',
    icon: 'cloud',
    summary:
      'CI/CD pipelines, cloud infrastructure, monitoring and automated testing that make releases routine instead of risky.',
    tags: ['CI/CD', 'Docker', 'Playwright', 'Cloud'],
    seo: {
      title: 'Cloud, DevOps & Automated QA',
      description:
        'Cloud, DevOps and QA: CI/CD pipelines, infrastructure as code, containers, monitoring and automated testing with Playwright and Vitest.',
      serviceType: 'Cloud infrastructure, DevOps and quality assurance',
    },
  },
  {
    slug: 'code-audit',
    name: 'Code Audit',
    icon: 'audit',
    summary:
      'An independent review of your existing system: code quality, architecture, security and performance, with a prioritised plan to fix what matters.',
    tags: ['Code review', 'Security', 'Architecture', 'Performance'],
    seo: {
      title: 'Code Audit & Software Health Check',
      description:
        'Independent code audits for existing software: code quality, architecture, security, performance and infrastructure, with a prioritised remediation plan.',
      serviceType: 'Software code audit',
    },
  },
  {
    slug: 'scaling-consulting',
    name: 'Scaling & Growth Consulting',
    icon: 'growth',
    summary:
      'Technology and process guidance for growing businesses: a roadmap, scalable architecture and automation so systems keep up with demand.',
    tags: ['Roadmaps', 'Architecture', 'Automation', 'Cost'],
    seo: {
      title: 'Scaling & Growth Consulting for Businesses',
      description:
        'Help scaling your business on the technology side: roadmaps, scalable architecture, process automation, cloud cost control and engineering practices.',
      serviceType: 'Technology consulting for business growth',
    },
  },
];

export function getService(slug: string | undefined): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
