import type { IconName } from '@/components/ui/icons';

export interface Faq {
  question: string;
  answer: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
}

/** Lightweight service info used across the whole site. */
export interface Service {
  slug: string;
  /** Short name used in nav, cards and form options. */
  name: string;
  icon: IconName;
  /** One or two sentences for cards. */
  summary: string;
  /** Technology labels on cards (keep to ~4). */
  tags: string[];
  seo: { title: string; description: string; serviceType: string };
}

/** Long-form content for a service page, loaded only with that page. */
export interface ServiceDetail {
  /** Page H1. */
  headline: string;
  /** Opening paragraph on the service page. */
  intro: string;
  problems: Array<{ title: string; description: string }>;
  capabilities: Array<{ title: string; description: string }>;
  deliverables: string[];
  technologies: Array<{ group: string; items: string[] }>;
  workflow: WorkflowStep[];
  /** How AI is used in this service, and where humans stay in charge. */
  aiNote: string;
  faqs: Faq[];
  related: string[];
}

export type ProjectCategory = 'Web' | 'Mobile' | 'AI & Automation' | 'Backend' | 'Design';

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  /**
   * "concept" = a self-initiated design/architecture study, never a client
   * engagement. "client" entries must be real, approved by the client, and
   * only list outcomes that were actually measured.
   */
  kind: 'concept' | 'client';
  summary: string;
  stack: string[];
  thumbnail: 'dashboard' | 'mobile' | 'assistant';
  services: string[];
  caseStudy: {
    problem: string;
    requirements: string[];
    approach: string[];
    architecture: Array<{ layer: string; detail: string }>;
    implementation: string[];
    /** Only measured, verifiable outcomes. Empty for concepts. */
    verifiedOutcomes: string[];
  };
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string };

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: 'AI Engineering' | 'Web Development' | 'Product & MVP';
  /** ISO date (YYYY-MM-DD). */
  published: string;
  updated?: string;
  /** Kept in sync with the body by a unit test. */
  readingMinutes: number;
  relatedServices: string[];
}

export interface Article extends ArticleMeta {
  body: ArticleBlock[];
}
