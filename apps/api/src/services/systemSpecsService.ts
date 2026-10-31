/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MonorepoAppSpec {
  name: string;
  directory: string;
  framework: string;
  runtime: string;
  description: string;
  keyTechnologies: string[];
  responsibilities: string[];
}

export interface MonorepoPackageSpec {
  name: string;
  directory: string;
  type: 'types' | 'validation' | 'utility';
  description: string;
  exports: string[];
}

export interface ArchitectureSpecification {
  projectName: string;
  tagline: string;
  version: string;
  architectureType: string;
  complianceStandards: string[];
  dataSafetyGuarantees: string[];
  monorepo: {
    rootWorkspaces: string[];
    apps: MonorepoAppSpec[];
    packages: MonorepoPackageSpec[];
  };
  database: {
    orm: string;
    engine: string;
    modelCount: number;
    models: {
      name: string;
      category: string;
      description: string;
    }[];
  };
  chromeExtension: {
    manifestVersion: number;
    permissions: string[];
    contentScripts: {
      script: string;
      matches: string[];
      methodology: string;
    }[];
    blockingEngine: string;
    privacyNotice: string;
  };
  phases: {
    phase: number;
    title: string;
    status: 'completed' | 'in_progress' | 'planned';
    summary: string;
  }[];
}

class SystemSpecsService {
  private readonly specs: ArchitectureSpecification = {
    projectName: 'FOCUSFLOW',
    tagline: 'Take Control of Your Time. Master Your Focus.',
    version: '1.0.0-prod',
    architectureType: 'TypeScript Monorepo (npm workspaces)',
    complianceStandards: [
      'FERPA & COPPA Student Privacy aligned',
      'Ethical non-invasive telemetry (No DOM scraping, no keylogging, no private messages)',
      'Consent & Privacy by Design with student opt-in',
      'OWASP Top 10 API Security with Helmet and CORS'
    ],
    dataSafetyGuarantees: [
      'Short-form video swipe counts are strictly non-intrusive client-side URL/DOM estimates',
      'Zero private browsing history logged or exported',
      'Parent and Counsellor sharing requires affirmative student cryptographic consent',
      'JWT tokens are short-lived with rotating refresh tokens'
    ],
    monorepo: {
      rootWorkspaces: [
        'apps/web',
        'apps/api',
        'apps/extension',
        'packages/shared-types',
        'packages/validation',
        'packages/shared-utils'
      ],
      apps: [
        {
          name: '@focusflow/web',
          directory: 'apps/web',
          framework: 'React 19 SPA + Vite',
          runtime: 'Browser',
          description: 'Unified student focus web application with real-time gamification, circadian planner, and analytics.',
          keyTechnologies: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Lucide React', 'Zustand', 'Motion'],
          responsibilities: [
            'Student productivity dashboard',
            'Focus timer with Pomodoro and deep work intervals',
            'AI Focus Coach chat and recommendations',
            'Gamification progression, badges, streak heatmaps',
            'Adaptive study planner and circadian scheduling',
            'Wellbeing intelligence and burnout prevention'
          ]
        },
        {
          name: '@focusflow/api',
          directory: 'apps/api',
          framework: 'Express.js + TypeScript',
          runtime: 'Node.js 22 LTS',
          description: 'Production REST API powering multi-tenant student sessions, analytics, AI agents, and integrations.',
          keyTechnologies: ['Express', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Zod', 'Helmet', 'bcrypt'],
          responsibilities: [
            'Session and auth management with JWT',
            'Prisma data access layer for PostgreSQL',
            'AI Focus recommendations via Gemini Flash API',
            'Gamification XP calculations, badge unlock triggers',
            'Counsellor portal aggregate queries with consent enforcement'
          ]
        },
        {
          name: '@focusflow/extension',
          directory: 'apps/extension',
          framework: 'Chrome Extension Manifest V3',
          runtime: 'Chromium Browser Background & Content Scripts',
          description: 'Distraction shielding browser companion providing ethical short-form reels capping and focus blocking.',
          keyTechnologies: ['Chrome MV3', 'Declarative Net Request', 'Chrome Storage API', 'Alarms API', 'Idle API'],
          responsibilities: [
            'Declarative Net Request dynamic website blocking during focus',
            'Non-intrusive short-form transition estimation (IG Reels, YT Shorts, FB Reels)',
            'Daily swipe quota counter with midnight reset',
            'Popup interface with quick focus toggle'
          ]
        }
      ],
      packages: [
        {
          name: '@focusflow/shared-types',
          directory: 'packages/shared-types',
          type: 'types',
          description: 'Common TypeScript domain contracts, database shapes, and API request/response payloads.',
          exports: ['User', 'FocusSession', 'DailySummary', 'ReelStat', 'Badge', 'StudyPlan', 'WellbeingMetric']
        },
        {
          name: '@focusflow/validation',
          directory: 'packages/validation',
          type: 'validation',
          description: 'Zod schemas validating all client form inputs and API payload boundaries.',
          exports: ['loginSchema', 'registerSchema', 'focusSessionSchema', 'consentSchema', 'studyPlanSchema']
        },
        {
          name: '@focusflow/shared-utils',
          directory: 'packages/shared-utils',
          type: 'utility',
          description: 'Pure deterministic utility functions for math, formatting, and calculations.',
          exports: ['calculateXpLevel', 'formatSecondsToHuman', 'sanitizeDomain', 'calculateStreakContinuity']
        }
      ]
    },
    database: {
      orm: 'Prisma ORM v6',
      engine: 'PostgreSQL 16',
      modelCount: 16,
      models: [
        { name: 'User', category: 'Auth & Identity', description: 'Student account record with role and email.' },
        { name: 'Profile', category: 'Auth & Identity', description: 'Student biographical details, target exams, and timezone.' },
        { name: 'Device', category: 'Sync', description: 'Registered browsers, extensions, and mobile clients.' },
        { name: 'PrivacyConsent', category: 'Compliance', description: 'Explicit opt-in permissions for counsellor/parent data sharing.' },
        { name: 'UsageSession', category: 'Telemetry', description: 'Aggregated active study periods and domain categories.' },
        { name: 'ReelDailyStat', category: 'Telemetry', description: 'Daily non-intrusive short-form reel swipe counts.' },
        { name: 'DailySummary', category: 'Analytics', description: 'End-of-day rollup of focus hours, distraction score, and XP.' },
        { name: 'FocusSession', category: 'Productivity', description: 'Individual Pomodoro or deep work timers completed.' },
        { name: 'FocusGoal', category: 'Productivity', description: 'Daily and weekly focus targets set by the student.' },
        { name: 'BlockedWebsite', category: 'Intervention', description: 'URL blacklist enforced during focus blocks.' },
        { name: 'AIRecommendation', category: 'Intelligence', description: 'Personalized focus insights generated by AI Coach.' },
        { name: 'XPTransaction', category: 'Gamification', description: 'Audit trail of XP awarded for study blocks and milestones.' },
        { name: 'Achievement', category: 'Gamification', description: 'Catalog of 24 unlockable badges and progress indicators.' },
        { name: 'Streak', category: 'Gamification', description: 'Active day counters with freeze protection.' },
        { name: 'StudyGroup', category: 'Social', description: 'Student study pods, group timers, and shared goals.' },
        { name: 'GroupMember', category: 'Social', description: 'Role and status in a collaborative study pod.' },
        { name: 'Notification', category: 'System', description: 'In-app alerts, streak reminders, and nudge banners.' }
      ]
    },
    chromeExtension: {
      manifestVersion: 3,
      permissions: ['tabs', 'storage', 'alarms', 'idle', 'declarativeNetRequest'],
      contentScripts: [
        {
          script: 'src/content/instagram.ts',
          matches: ['*://*.instagram.com/reels/*', '*://*.instagram.com/reel/*'],
          methodology: 'MutationObserver monitoring URL pathname transitions without touching post content or messages'
        },
        {
          script: 'src/content/youtube.ts',
          matches: ['*://*.youtube.com/shorts/*'],
          methodology: 'Popstate & yt-navigate-finish event listener observing Shorts counter increments'
        },
        {
          script: 'src/content/facebook.ts',
          matches: ['*://*.facebook.com/reel/*'],
          methodology: 'History pushState listener estimating video transitions'
        }
      ],
      blockingEngine: 'Declarative Net Request dynamic ruleset updating on focus timer start/stop',
      privacyNotice: 'Zero DOM text scraping, zero keylogging, zero audio/video capture, zero private messaging access.'
    },
    phases: [
      { phase: 1, title: 'Project Foundation & Monorepo Architecture', status: 'completed', summary: 'TypeScript Monorepo, Prisma schema, Express backend, MV3 extension structure, shared packages.' },
      { phase: 2, title: 'UI/UX Design System & Web App', status: 'completed', summary: 'Dark-first responsive design, student dashboard, navigation, typography, design tokens.' },
      { phase: 3, title: 'Backend REST API & Services', status: 'completed', summary: 'JWT auth, Prisma data services, controllers, error middleware, health checks.' },
      { phase: 4, title: 'Chrome Extension MV3 & Blocker', status: 'completed', summary: 'Reels estimation, Declarative Net Request site blocking, storage sync, popup UI.' },
      { phase: 5, title: 'AI Focus Coach Integration', status: 'completed', summary: 'Gemini Flash 2.5 API integration, structured prompts, personalized study advice.' },
      { phase: 6, title: 'Gamification, Streaks & Social Pods', status: 'completed', summary: '24 achievements, XP levels, streak freezes, friend circles, study group timers.' },
      { phase: 7, title: 'Mobile Architecture & Android Specs', status: 'completed', summary: 'Kotlin MVVM architecture specs, AccessibilityService usage tracking, local notifications.' },
      { phase: 8, title: 'Testing, Security Audit & Launch Preparation', status: 'completed', summary: 'Production audit, security audit, database hardening, release checklists.' },
      { phase: 9, title: 'Adaptive Study Planner & Wellbeing Intelligence', status: 'completed', summary: 'Circadian study scheduler, burnout prevention engine, student SaaS tier billing.' },
      { phase: 10, title: 'AI Swarm, Smart Automations & Counsellor Portal', status: 'completed', summary: 'Autonomous multi-agent study crew, event-driven webhooks, FERPA-compliant counsellor dashboard.' }
    ]
  };

  public getArchitectureSpecs(): ArchitectureSpecification {
    return this.specs;
  }

  public getMonorepoBreakdown() {
    return {
      success: true,
      data: {
        monorepo: this.specs.monorepo,
        database: this.specs.database,
        chromeExtension: this.specs.chromeExtension,
        compliance: this.specs.complianceStandards,
        dataSafety: this.specs.dataSafetyGuarantees,
        generatedAt: new Date().toISOString()
      }
    };
  }
}

export const systemSpecsService = new SystemSpecsService();
