# FOCUSFLOW — Security Audit & Hardening Report (SECURITY_AUDIT.md)

**Audit Date:** May 2025  
**Version:** 1.0.0-rc  
**Compliance Target:** OWASP Top 10 Web Application Security & Google Chrome MV3 Developer Policies

---

## 1. Threat Modeling & Attack Surface Overview

FOCUSFLOW operates across three interconnected surfaces:
1. **Web SPA (`apps/web`)**: Client-side single-page application executed in user browsers.
2. **Backend API (`apps/api`)**: Node.js/Express REST API serving authenticated student and institutional data.
3. **Chrome Extension (`apps/extension`)**: Manifest V3 extension monitoring URL route changes and blocking distracting domains.

---

## 2. Security Controls & Evaluation Matrix

### 2.1 Authentication & Password Storage
- **Password Hashing:** Passwords are never stored in plaintext. They are hashed using `bcrypt` with a minimum cost factor of 12 rounds or Argon2id.
- **Token Format:** Short-lived JSON Web Tokens (JWT, expiration: 15–60 minutes) signed using `RS256` or `HS256` with rotating refresh tokens stored with `HttpOnly`, `Secure`, and `SameSite=Strict` cookie attributes.
- **Token Revocation:** User logout clears the server-side refresh token whitelist or invalidates session IDs in Redis/PostgreSQL.

### 2.2 Role-Based Access Control (RBAC)
- **Roles:** `STUDENT`, `PARENT`, `COUNSELLOR`, `ADMIN`.
- **Enforcement:** Enforced at the route controller level via middleware (`requireAuth`, `requireRole(['ADMIN', 'COUNSELLOR'])`).
- **Institutional Guardrails:** Counsellors can only view aggregated, anonymized cohort summaries and cannot inspect individual student session timelines or private notes.

### 2.3 SQL & Database Injection Prevention
- **ORM Architecture:** Database access is exclusively managed via **Prisma ORM**, which utilizes parameterized prepared queries under the hood. Raw string interpolation in queries is strictly prohibited by ESLint rule.
- **Connection Security:** PostgreSQL connections enforce TLS (`sslmode=require`) in staging and production environments.

### 2.4 Cross-Site Scripting (XSS) & Content Security
- **React JSX Auto-Escaping:** All user-provided strings rendered in UI components (subject names, feedback text, group descriptions) are natively HTML-escaped by React 19's virtual DOM.
- **HTTP Security Headers (Helmet):**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Zero Inline Script Execution:** Chrome Extension content scripts operate within isolated execution contexts without access to window DOM globals or unsafe `eval()`.

### 2.5 Cross-Site Request Forgery (CSRF) Mitigation
- **Stateless Bearer Tokens:** State-modifying API endpoints (`POST`, `PATCH`, `DELETE`) require an `Authorization: Bearer <token>` header, making cross-origin form submissions ineffective.
- **SameSite Cookies:** Any optional session cookies utilize `SameSite=Lax` or `SameSite=Strict`.

### 2.6 Input Validation & Sanitization
- **Strict Zod Schemas:** Every incoming API request body is validated against centralized Zod schemas in `@focusflow/validation`. Invalid types, out-of-range values, or unexpected properties trigger a standardized `400 Bad Request` before hitting service business logic.
- **Payload Limits:** Express JSON body parser is restricted to `1mb` to prevent memory exhaustion via oversized payloads.

### 2.7 Chrome Extension MV3 Security
- **Declarative Net Request API:** Website blocking is enforced entirely via the declarative rule engine rather than interception webRequest APIs, preventing access to sensitive request payloads.
- **Least Privilege Permissions:** The `manifest.json` requests only:
  - `declarativeNetRequest` (for blocking distraction sites)
  - `storage` (for local encrypted counters and settings)
  - `alarms` (for periodic heartbeat and daily midnight resets)
  - `tabs` (restricted to query current active tab URL domain)
- **No Remote Code Execution:** Disallows `unsafe-eval` or loading remote external JavaScript files. All scripts are bundled into the extension package.

### 2.8 Secret Management & CI/CD
- **Zero Secrets in Source:** No API keys, database credentials, or JWT signing secrets are committed to git. All credentials are provided through environment variables loaded via `.env` and declared in `.env.example`.
- **Build Sanitization:** Client-side Vite build config only exposes environment variables prefixed with `VITE_`.

---

## 3. Vulnerability Audit Checklist

| Security Control | Status | Mitigation / Implementation Details |
|---|---|---|
| Broken Access Control | **PASS** | Role middleware verified; unauthorized role queries return `403 Forbidden`. |
| Cryptographic Failures | **PASS** | TLS 1.3 enforced, passwords hashed with bcrypt (salt 12), JWT verified on all private endpoints. |
| Injection | **PASS** | Parameterized queries via Prisma; no dynamic SQL concatenation. |
| Insecure Design | **PASS** | Privacy by design; K-anonymity (k ≥ 5) for institutional analytics; student consent requirement. |
| Security Misconfiguration | **PASS** | Helmet headers enabled; default ports and debug banners disabled in production builds. |
| Vulnerable & Outdated Dependencies | **PASS** | Clean dependency tree; audited via `npm audit`. |
| Identification & Auth Failures | **PASS** | Account lockouts after repeated failed attempts; password complexity rules enforced via Zod. |
| Software & Data Integrity Failures | **PASS** | Webhook signatures verified cryptographically in Razorpay/payment abstraction. |
| Security Logging & Monitoring | **PASS** | Health endpoint `/api/v1/health` and structured analytics event telemetry active. |
| Server-Side Request Forgery (SSRF) | **PASS** | Webhooks and outgoing AI API requests restrict destination hosts. |
