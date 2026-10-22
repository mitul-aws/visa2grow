import type { Project, ProjectCategory } from '@/types/content';

/**
 * Portfolio entries.
 *
 * Everything below is a CONCEPT: a self-initiated study showing how we would
 * approach a problem. None of these are client engagements, and none list
 * outcomes, because nothing has been measured.
 *
 * To add real work: add an entry with kind: 'client', use only details the
 * client has approved, and put measured results in verifiedOutcomes.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'ai-document-assistant',
    name: 'AI Document Q&A Assistant',
    category: 'AI & Automation',
    kind: 'concept',
    summary:
      'A concept for an internal assistant that answers staff questions from company policies and manuals, always citing the source passage.',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL + pgvector', 'Hosted LLM API'],
    thumbnail: 'assistant',
    services: ['ai-automation', 'backend-api-development', 'web-development'],
    caseStudy: {
      problem:
        'In many organisations, answers to routine questions live in long PDFs and wikis. Staff either search for a long time or ask a colleague, and the answers they get are not always current. This concept explores an assistant that answers from approved documents only, and shows where each answer came from.',
      requirements: [
        'Answer only from an approved document set; say “I don’t know” otherwise.',
        'Show the source document and passage for every answer.',
        'Respect document permissions so people only see what they are allowed to.',
        'Keep per-question cost predictable and visible to administrators.',
        'Let administrators add, update and retire documents without engineering help.',
      ],
      approach: [
        'Start with an evaluation set of real questions and expected sources before building the interface.',
        'Use hybrid retrieval (keyword + semantic) because policy documents often hinge on exact terms.',
        'Constrain generation to retrieved passages and validate that citations exist in the source.',
        'Log questions without personal data to find gaps in the documentation itself.',
      ],
      architecture: [
        { layer: 'Interface', detail: 'React web app with chat-style Q&A, inline citations and a document viewer.' },
        { layer: 'API', detail: 'Node.js service handling auth, permission filtering, retrieval and model calls.' },
        { layer: 'Retrieval', detail: 'PostgreSQL with pgvector for embeddings plus full-text search, merged and re-ranked.' },
        { layer: 'Ingestion', detail: 'Background jobs that parse, chunk and embed documents when they change.' },
        { layer: 'Model', detail: 'Provider-agnostic adapter so the language model can be swapped or self-hosted.' },
      ],
      implementation: [
        'Typed API contract shared between front-end and back-end.',
        'Evaluation script that runs the question set and reports answer and citation accuracy.',
        'Rate limiting and per-user cost caps enforced on the server.',
        'Admin screens for document upload, status and retirement.',
      ],
      verifiedOutcomes: [],
    },
  },
  {
    slug: 'offline-field-inspection-app',
    name: 'Offline-First Field Inspection App',
    category: 'Mobile',
    kind: 'concept',
    summary:
      'A concept for a cross-platform app that lets inspectors complete checklists, photos and signatures without signal, then syncs safely.',
    stack: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Node.js'],
    thumbnail: 'mobile',
    services: ['mobile-app-development', 'backend-api-development', 'ui-ux-design'],
    caseStudy: {
      problem:
        'Teams working on construction sites, farms or in basements often have no reliable connection. Paper forms are re-typed later and mistakes creep in. This concept explores an app where offline is the default state, not an error.',
      requirements: [
        'Complete an entire inspection with no connectivity.',
        'Capture photos, notes and a signature attached to each checklist item.',
        'Sync automatically when online and never silently lose or overwrite data.',
        'Work on both iOS and Android from one codebase.',
        'Large touch targets and high contrast for outdoor use.',
      ],
      approach: [
        'Treat the on-device database as the source of truth for the user’s work.',
        'Queue changes as an append-only log and sync them in the background.',
        'Detect conflicts on the server and surface them for a person to resolve.',
        'Design for gloves and sunlight: big targets, strong contrast, minimal typing.',
      ],
      architecture: [
        { layer: 'App', detail: 'React Native + Expo, with local SQLite storage and a background sync queue.' },
        { layer: 'Media', detail: 'Photos compressed on device and uploaded with resumable transfers.' },
        { layer: 'Sync API', detail: 'Node.js endpoints that accept batched changes idempotently.' },
        { layer: 'Data', detail: 'PostgreSQL with per-record versioning to detect conflicting edits.' },
      ],
      implementation: [
        'Checklist templates defined as data so new inspection types need no app release.',
        'Sync status visible on every record: saved locally, syncing, synced or needs attention.',
        'Unit tests for the sync queue and conflict rules; end-to-end tests for the core flow.',
      ],
      verifiedOutcomes: [],
    },
  },
  {
    slug: 'retail-operations-dashboard',
    name: 'Operations Dashboard for Online Retail',
    category: 'Web',
    kind: 'concept',
    summary:
      'A concept for a single dashboard that brings orders, stock and fulfilment issues from several tools into one prioritised view.',
    stack: ['React', 'TypeScript', 'TanStack Query', 'Node.js', 'PostgreSQL'],
    thumbnail: 'dashboard',
    services: ['web-development', 'backend-api-development', 'ui-ux-design'],
    caseStudy: {
      problem:
        'Small online retailers often juggle a storefront, a shipping tool, a spreadsheet for stock and an inbox for issues. Problems such as low stock or delayed shipments are noticed late. This concept explores one operational view that highlights what needs attention today.',
      requirements: [
        'Pull orders, stock levels and shipment status from existing tools via their APIs.',
        'Highlight exceptions (low stock, late shipments, failed payments) rather than raw data.',
        'Load quickly and remain usable with thousands of orders.',
        'Role-based access for owners and warehouse staff.',
      ],
      approach: [
        'Design around a daily “what needs attention” list instead of a wall of charts.',
        'Sync data into a single database on a schedule and via webhooks, rather than querying every tool live.',
        'Keep rules for exceptions configurable by the business owner.',
      ],
      architecture: [
        { layer: 'Interface', detail: 'React + TypeScript dashboard with virtualised tables and saved filters.' },
        { layer: 'API', detail: 'Node.js service exposing aggregated, permission-filtered data.' },
        { layer: 'Integrations', detail: 'Connector jobs per external tool, with retries and error reporting.' },
        { layer: 'Data', detail: 'PostgreSQL as the unified store, with materialised views for summaries.' },
      ],
      implementation: [
        'Exception rules evaluated on the server and stored, so history is auditable.',
        'Accessible data tables with keyboard navigation and screen-reader labels.',
        'Playwright tests for login, filtering and exception workflows.',
      ],
      verifiedOutcomes: [],
    },
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Web', 'Mobile', 'AI & Automation', 'Backend', 'Design'];

export function getProject(slug: string | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
