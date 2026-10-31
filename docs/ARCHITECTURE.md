# FOCUSFLOW — Architecture & System Design

## 1. System Overview

FOCUSFLOW is an AI-powered digital wellbeing and study productivity platform designed specifically for students facing cognitive fragmentation from algorithmic short-form video feeds (Instagram Reels, YouTube Shorts, and Facebook Reels).

The system integrates three primary clients communicating with a centralized Node.js/Express backend and PostgreSQL database:

```
┌────────────────────────────────────────────────────────┐
│                   Student Clients                      │
├─────────────────────────┬──────────────────────────────┤
│    Web Application      │   Chrome Extension (MV3)     │
│  (React 19, TypeScript) │ (Service Worker, Blocker)    │
└────────────┬────────────┴──────────────┬───────────────┘
             │                           │
             │ HTTPS / REST              │ Batch Sync
             ▼                           ▼
┌────────────────────────────────────────────────────────┐
│             FOCUSFLOW Express API Gateway              │
│      (CORS, Helmet, Zod Validation, JWT Auth)          │
└────────────────────────────┬───────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│ PostgreSQL via Prisma │         │   AI Focus Engine     │
│  (16 Relational DB    │         │ (Gemini / OpenAI API  │
│        Models)        │         │   Server-Side Proxy)  │
└───────────────────────┘         └───────────────────────┘
```

---

## 2. Monorepo Organization

```
focusflow/
├── apps/
│   ├── web/                     # Student web dashboard, timers & analytics
│   ├── api/                     # Node.js Express REST API & Prisma client
│   └── extension/               # Chrome Extension Manifest V3 companion
├── packages/
│   ├── shared-types/            # Reusable domain interfaces & data contracts
│   ├── validation/              # Zod validation schemas
│   └── shared-utils/            # Time formatters, sanitizers, XP calculations
├── docs/                        # Architecture, DB, API, and Security guides
└── .cursor/rules/               # Cursor AI engineering directives
```

---

## 3. Communication Patterns

1. **Client-to-Backend**: REST API over HTTPS using standard JSON bodies and Bearer JWT tokens.
2. **Short-Form Feed Detection**:
   - Chrome Extension content scripts monitor non-intrusive URL and DOM transitions (`/reels/`, `/shorts/`).
   - Counts are debounced, aggregated, and stored locally in Chrome storage before batched sync.
3. **Website Blocking**:
   - Enforced client-side via Chrome `declarativeNetRequest` dynamic rules.
   - Rules are activated when a Pomodoro or Deep Work session begins.
