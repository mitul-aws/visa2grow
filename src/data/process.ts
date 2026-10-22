import type { IconName } from '@/components/ui/icons';

export interface ProcessStep {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  /** Details shown on the /process page. */
  details: string[];
  youProvide: string;
  youReceive: string;
}

export const PROCESS: ProcessStep[] = [
  {
    id: 'discover',
    title: 'Discover',
    icon: 'search',
    summary: 'Understand your goals, users, constraints and what success looks like.',
    details: [
      'An initial call to understand the business problem, not just the feature list.',
      'Review of any existing product, code, designs, analytics or documents.',
      'Identification of risks, unknowns and assumptions that need testing early.',
    ],
    youProvide: 'Context about the business, users and any existing material.',
    youReceive: 'A written summary of goals, constraints and open questions.',
  },
  {
    id: 'define',
    title: 'Define',
    icon: 'target',
    summary: 'Establish scope, priorities, milestones and a realistic estimate.',
    details: [
      'Requirements are split into must-have, should-have and later.',
      'Estimates are given as ranges, with the assumptions behind them written down.',
      'Milestones are defined around usable increments rather than arbitrary dates.',
    ],
    youProvide: 'Decisions on priorities and trade-offs.',
    youReceive: 'Scope document, milestone plan and estimate range.',
  },
  {
    id: 'design',
    title: 'Design',
    icon: 'pen',
    summary: 'Plan the user experience and the technical approach together.',
    details: [
      'User flows and wireframes for the journeys that matter most.',
      'Architecture decisions recorded with the reasoning and alternatives considered.',
      'Technical spikes for anything risky before the main build starts.',
    ],
    youProvide: 'Feedback on flows, designs and key decisions.',
    youReceive: 'Approved designs and a documented technical approach.',
  },
  {
    id: 'develop',
    title: 'Develop',
    icon: 'code',
    summary: 'Build in short increments with AI-assisted workflows and human oversight.',
    details: [
      'AI tools accelerate scaffolding, refactoring, tests and documentation.',
      'Every change is reviewed by an engineer before it is merged.',
      'Regular demos on a preview environment so progress is visible, not reported.',
    ],
    youProvide: 'Timely feedback on each increment.',
    youReceive: 'Working software you can click through at every milestone.',
  },
  {
    id: 'validate',
    title: 'Validate',
    icon: 'shield',
    summary: 'Test functionality, performance, accessibility and security.',
    details: [
      'Automated tests run on every change; critical journeys get end-to-end coverage.',
      'Manual exploratory testing across browsers and devices.',
      'Performance, accessibility and security checks before release.',
    ],
    youProvide: 'User acceptance testing against the agreed scope.',
    youReceive: 'Test results and a list of any known limitations.',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    icon: 'rocket',
    summary: 'Deploy, document and support the solution after launch.',
    details: [
      'Production deployment with monitoring in place from day one.',
      'Handover documentation: architecture, setup, deployment and operations.',
      'An agreed post-launch support window for fixes and adjustments.',
    ],
    youProvide: 'Access to production accounts owned by your business.',
    youReceive: 'Live product, source code, documentation and a handover session.',
  },
];
