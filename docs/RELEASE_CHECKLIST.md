# FOCUSFLOW — Production Release & Launch Checklist (RELEASE_CHECKLIST.md)

**Target Release:** FOCUSFLOW v1.0.0 Production GA  
**Lead Engineer:** Senior Full-Stack Software Architect  
**Sign-off Criteria:** Zero critical vulnerabilities, clean compilation, automated smoke tests passing.

---

## 1. Pre-Flight Verification Checklist

- [x] **Monorepo Typecheck:** `npx tsc --noEmit` passes with 0 errors across `apps/web`, `apps/api`, `apps/extension`, and all `packages/`.
- [x] **Code Quality & Linting:** ESLint clean; no `any` types in domain boundaries; no hardcoded API keys.
- [x] **Environment Variables:** All required production keys defined in `.env.example` with clear documentation.
- [x] **Database Migrations:** Prisma schema in sync; `prisma migrate status` clean; all migrations applied.
- [x] **Security Headers:** Helmet headers enabled; CORS configured for production domain only.
- [x] **Ethical Telemetry:** Reels & Shorts transition estimates verified with 2500ms cooldown; explicit disclaimer visible.
- [x] **Privacy Safeguards:** K-Anonymity (k ≥ 5) active on institutional endpoints; student consent required.
- [x] **Payment Gateway:** Mock Razorpay adapter tested with simulated signature verification; production webhook secret configured.
- [x] **Chrome Extension MV3:** `manifest.json` validated against Chrome Web Store policies; Declarative Net Request rules active.
- [x] **Health Checks:** Endpoint `GET /api/v1/health` returning 200 OK with memory, uptime, and status.

---

## 2. Deployment Procedures

### 2.1 Backend API & Web SPA (Full-Stack Deployment)
1. **Build Artifacts:**
   ```bash
   npm run build
   ```
2. **Execute Database Migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Start Production Service:**
   ```bash
   NODE_ENV=production PORT=3000 node server.ts
   ```

### 2.2 Chrome Extension Packaging
1. Navigate to extension directory:
   ```powershell
   # Windows PowerShell
   cd apps/extension
   npm run build
   # Compress into focusflow-extension-v1.0.0.zip for Chrome Web Store Developer Dashboard
   Compress-Archive -Path dist/* -DestinationPath focusflow-extension-v1.0.0.zip
   ```
   ```bash
   # Unix / Bash
   cd apps/extension && npm run build
   zip -r focusflow-extension-v1.0.0.zip dist/
   ```
2. Upload `focusflow-extension-v1.0.0.zip` to the **Chrome Web Store Developer Dashboard**.

### 2.3 Android APK Release Build
1. Build production release bundle:
   ```bash
   cd apps/android || cd android
   ./gradlew assembleRelease
   ```
2. Verify signed APK generated at `app/build/outputs/apk/release/app-release.apk`.

---

## 3. Automated Post-Deployment Smoke Tests

Execute these verification requests immediately after deployment:

```bash
# 1. Verify API Health & Uptime
curl -s -f http://localhost:3000/api/v1/health || exit 1

# 2. Verify Study Planner API
curl -s -f -X POST http://localhost:3000/api/v1/planner/schedule \
  -H "Content-Type: application/json" \
  -d '{"energyArchetype":"MORNING_LARK","targetHours":5}' || exit 1

# 3. Verify Wellbeing Health Score
curl -s -f http://localhost:3000/api/v1/wellbeing/health-score || exit 1

# 4. Verify Multi-Agent Swarm Synthesis
curl -s -f -X POST http://localhost:3000/api/v1/ai-agents/synthesis || exit 1

# 5. Verify Institutional K-Anonymity Guard
curl -s -f http://localhost:3000/api/v1/institutions/cohorts/inst-small-test | grep "DATA REDACTED" || exit 1
```

---

## 4. Rollback & Fail-Safe Playbook

If unrecoverable errors, elevated error rates (> 1%), or memory leaks occur during rollout:
1. **Instant Traffic Reversion:** Point CDN / Load Balancer routing back to the previous stable release container image.
2. **Database Rollback:** If a destructive migration was run, restore the pre-deployment database snapshot taken prior to rollout.
3. **Incident Notice:** Dispatch alert to Discord/Slack on-call channel with timestamp, error log trace, and rollback confirmation.

---

## 5. Alerting & Monitoring Thresholds

| Metric | Warning Threshold | Critical Alert | Action Required |
|---|---|---|---|
| HTTP 5xx Error Rate | > 0.5% for 3 mins | > 2.0% for 1 min | Page on-call engineer; review `/api/v1/health` logs |
| API P95 Latency | > 400ms | > 1,500ms | Check PostgreSQL connection pool exhaustion |
| Server Memory (RSS) | > 80% RAM limit | > 92% RAM limit | Restart node worker; inspect memory profile |
| Extension Sync Failures | > 3% failure rate | > 8% failure rate | Inspect route debouncing and CORS headers |
