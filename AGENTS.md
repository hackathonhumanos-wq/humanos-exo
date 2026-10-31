# FOCUSFLOW — Engineering Agent Guidelines (AGENTS.md)

This document establishes the architectural principles, data safety standards, and coding conventions for all autonomous coding agents working on the FOCUSFLOW codebase.

---

## 1. Core Engineering Principles

1. **Always Use TypeScript**: All files across `apps/` and `packages/` must be strictly typed. Avoid `any`; use domain interfaces from `@focusflow/shared-types`.
2. **Modular & Reusable Code**: Keep components, services, and hooks focused on a single responsibility.
3. **Clean Architecture**: Strictly maintain separation between controllers, business logic services, routes, and data access layers.
4. **Validate All API Inputs**: Enforce validation on every endpoint using Zod schemas from `@focusflow/validation`.
5. **Secure Authentication Practices**: Store passwords using bcrypt/argon2, issue short-lived JWT access tokens with rotating refresh tokens, and verify tokens via middleware.
6. **Zero Secrets in Source**: Never hardcode API keys, secrets, or database URLs in source code. Reference environment variables through configuration loaders.
7. **Ethical Telemetry & No Fake Data**:
   - Short-form video transitions (Instagram Reels, YouTube Shorts, Facebook Reels) are strictly non-intrusive estimates.
   - Never claim to have exact view telemetry from private APIs.
   - Never collect screenshots, keystrokes, personal messages, or private browsing history.
8. **Clearly Label Demo Data**: In prototype or testing modes, explicitly tag mock data objects with `[DEMO]` or `isDemo: true`.
9. **Resilient UX States**: Every interactive component must gracefully handle `loading`, `empty`, `error`, and `success` states.
10. **Consent & Privacy by Design**: All parent/counsellor sharing features require explicit, opt-in student consent stored in `PrivacyConsent`.
11. **Inspection Before Modification**: Inspect existing files and dependency trees before modifying existing code to avoid regressions.

---

## 2. Monorepo Organization

- **`apps/web`**: React 19 SPA, Tailwind CSS, Lucide icons, modular pages.
- **`apps/api`**: Node.js, Express, Helmet, CORS, Prisma ORM with PostgreSQL.
- **`apps/extension`**: Chrome Extension Manifest V3, Declarative Net Request blocker, service worker, content scripts.
- **`packages/shared-types`**: Shared domain contracts and API shapes.
- **`packages/validation`**: Zod validation schemas for requests and forms.
- **`packages/shared-utils`**: Pure deterministic utility functions.

---

## 3. Workflow Protocol

### Before Any Implementation
1. Inspect affected files and dependencies.
2. Formulate a concise implementation plan.
3. Confirm data schema compatibility.

### After Implementation
1. List all created and modified files.
2. Provide executable commands for Windows PowerShell and Unix bash.
3. Run compilation, typecheck, and linting checks.
4. Report any remaining limitations transparently.
