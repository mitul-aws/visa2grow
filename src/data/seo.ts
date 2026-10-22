import type { SeoData } from '@/lib/seo';

/**
 * Titles, descriptions and canonical paths for static pages, in one place.
 * Dynamic pages (services, portfolio items, articles) derive theirs from
 * their own data files. Titles get " | Visa2Grow" appended automatically.
 */
export const PAGE_SEO = {
  home: {
    title: 'Visa2Grow — AI-First Software Development | Ideas to Impact',
    description:
      'AI-first software studio: web, mobile and AI development, code audits and scaling support, with human-reviewed engineering and 10+ years of industry experience.',
    path: '/',
  },
  services: {
    title: 'Software Development Services: Web, Mobile & AI',
    description:
      'Web, mobile and AI development, backend APIs, UI/UX, cloud and QA, plus code audits and scaling consulting, delivered with AI-first, human-led engineering.',
    path: '/services',
  },
  portfolio: {
    title: 'Portfolio: Our Apps & Concept Studies',
    description:
      'Android apps designed, built and published by Visa2Grow on Google Play, plus clearly labelled concept studies. No invented client results.',
    path: '/portfolio',
  },
  process: {
    title: 'Our Software Delivery Process',
    description:
      'How Visa2Grow delivers software: discovery, scoping with estimate ranges, design, AI-assisted development with human review, QA and documented handover.',
    path: '/process',
  },
  about: {
    title: 'About Visa2Grow — An AI-First Software Studio',
    description:
      'Visa2Grow is a new AI-first software development company built on 10+ years of industry experience, focused on maintainable, human-reviewed engineering.',
    path: '/about',
  },
  insights: {
    title: 'Insights on AI Engineering, Web Development & MVPs',
    description:
      'Practical articles on AI-assisted development, React and SEO, MVP scoping and building maintainable software, from the Visa2Grow team.',
    path: '/insights',
  },
  contact: {
    title: 'Start a Project — Contact Visa2Grow',
    description:
      'Tell us about your web, mobile or AI project. Share your goals, timeline and budget range, and we’ll reply with questions and a suggested approach.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Notice',
    description: 'How Visa2Grow handles the information you share through this website and the project inquiry form.',
    path: '/privacy',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you were looking for doesn’t exist or has moved.',
    noindex: true,
  },
} satisfies Record<string, SeoData>;
