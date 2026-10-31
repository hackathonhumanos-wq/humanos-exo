# FOCUSFLOW — Digital Wellbeing & AI Focus Coach

FOCUSFLOW is an AI-powered productivity platform that helps students reduce short-form video distraction (Instagram Reels, YouTube Shorts, Facebook Reels), preserve deep cognitive focus, and build healthier study routines.

---

## 1. Problem Statement

Students lose hours daily to short-form video dopamine loops. Existing screen-time blockers often lack meaningful student accountability, gamified habit formation, and personalized cognitive guidance. FOCUSFLOW solves this through ethical distraction estimation, adaptive focus timers, Declarative Net Request website blocking, and AI coaching.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express.js, TypeScript, Helmet, CORS, Zod validation.
- **Database**: PostgreSQL with Prisma ORM (16 relational models).
- **Chrome Extension**: Manifest V3, Declarative Net Request, Service Worker, Chrome Alarms & Idle APIs.
- **AI Engine**: Server-side proxy for Gemini API / OpenAI API.

---

## 3. Monorepo Architecture

```
focusflow/
├── apps/
│   ├── web/                     # React + TypeScript + Vite Student Dashboard
│   ├── api/                     # Node.js + Express REST API (Prisma PostgreSQL)
│   └── extension/               # Chrome Extension Manifest V3 companion
├── packages/
│   ├── shared-types/            # Shared TypeScript domain contracts
│   ├── validation/              # Zod schemas for auth, telemetry, and goals
│   └── shared-utils/            # Time formatters, domain sanitizers, XP calculations
├── docs/                        # Architecture, DB, API, Security, Setup guides
├── .cursor/rules/focusflow.mdc  # Cursor AI development rules
├── AGENTS.md                    # Engineering principles and protocol
├── .env.example                 # Root environment template
└── package.json                 # Monorepo workspaces & dev scripts
```

---

## 4. Quick Start (Windows 11 PowerShell)

### Installation
```powershell
# Install all dependencies across monorepo workspaces
npm install

# Copy environment variable templates
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
```

### Development Commands
```powershell
# Unified Full-Stack Dev Server (Express API + Vite on Port 3000)
npm run dev

# Frontend Web Application only
npm run dev:web

# Backend API server only (Port 4000)
npm run dev:api

# Chrome Extension typecheck & build
npm run build:extension

# Build all monorepo workspaces
npm run build
```

---

## 5. API Health Verification

Test the backend health endpoint:
```powershell
# PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/v1/health

# Output:
# success message
# ------- -------
#    True FOCUSFLOW API is running
```

---

## 6. Implementation Status (Phase 1)

- [x] Monorepo workspace configuration (`apps/web`, `apps/api`, `apps/extension`, `packages/*`).
- [x] Shared TypeScript definitions (`@focusflow/shared-types`).
- [x] Shared Zod validation schemas (`@focusflow/validation`).
- [x] Shared utilities (`@focusflow/shared-utils`).
- [x] Express backend foundation with Helmet, CORS, centralized errors, and `GET /api/v1/health`.
- [x] Prisma PostgreSQL schema with 16 relational models and indexes.
- [x] Chrome Extension Manifest V3 structure with Service Worker, Content Scripts, and Popup.
- [x] React web application with 12 starter pages and interactive Phase 1 Architecture Inspector.
- [x] Cursor AI engineering rules (`.cursor/rules/focusflow.mdc`) and `AGENTS.md`.
- [x] Comprehensive documentation in `docs/`.
