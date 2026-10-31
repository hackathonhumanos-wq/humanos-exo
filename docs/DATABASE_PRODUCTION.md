# FOCUSFLOW — Production Database Architecture & Operations Guide (DATABASE_PRODUCTION.md)

**Audit Date:** May 2025  
**Version:** 1.0.0-rc  
**Database Engine:** PostgreSQL 16+ with Prisma ORM

---

## 1. Database Architecture & Schema Overview

FOCUSFLOW uses PostgreSQL as its primary relational store. The schema is defined declaratively in `apps/api/prisma/schema.prisma` and compiled into strongly-typed TypeScript models using `@prisma/client`.

### Core Entities & Relationships
- `User`: Primary account record with role (`STUDENT`, `PARENT`, `COUNSELLOR`, `ADMIN`).
- `FocusSession`: Records every completed Pomodoro, Deep Work, or Exam Prep session.
- `DailySummary`: Pre-aggregated daily statistics (total focus minutes, estimated reel count, XP earned).
- `ReelStat`: Platform-specific transition counts (Instagram Reels, YouTube Shorts).
- `BlockedSite`: User-configured or system domain rules for the browser extension.
- `PrivacyConsent`: 1-to-1 relation with `User` storing explicit parent and counsellor consent flags.
- `XPTransaction`: Append-only ledger of earned XP, activities, and references preventing double-crediting.
- `Achievement`: Badge definitions and unlocked timestamps.
- `StreakRecord`: Daily streak history and freeze safety tokens.
- `Challenge`: Daily and weekly focus quests with status tracking.
- `StudyGroup` & `GroupMember`: Collaborative study circles with invite codes.
- `ProductFeedback`: In-app student feedback, ratings, and triage status.
- `AutomationRule`: Smart trigger-action focus rules.

---

## 2. Production Indexing Strategy

To guarantee sub-50ms query response times even as data scales to millions of sessions, optimal compound indexes are defined across high-frequency lookup columns:

```prisma
model FocusSession {
  id                     String    @id @default(uuid())
  userId                 String
  startTime              DateTime  @default(now())
  endTime                DateTime?
  plannedDurationMinutes Int
  actualDurationMinutes  Int?
  mode                   FocusMode @default(POMODORO)
  completed              Boolean   @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Compound index for user history retrieval ordered by start time
  @@index([userId, startTime(sort: Desc)])
  @@index([userId, completed])
}

model DailySummary {
  id                     String   @id @default(uuid())
  userId                 String
  date                   String   // YYYY-MM-DD
  totalFocusMinutes      Int      @default(0)
  totalReelsEstimated    Int      @default(0)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Unique constraint ensures one summary per user per calendar day
  @@unique([userId, date])
  @@index([date])
}

model XPTransaction {
  id           String   @id @default(uuid())
  userId       String
  amount       Int
  activityType String
  referenceId  String?  // Id of focus session or challenge
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Index prevents duplicate reward claims for the same activity
  @@index([userId, referenceId])
}
```

---

## 3. Connection Pooling & Scale-to-Zero Resiliency

### 3.1 PgBouncer & Transaction Pooling
- In production cloud deployments (e.g., Supabase, Neon, Cloud SQL, AWS Aurora), connection poolers (PgBouncer) are mandatory to mitigate PostgreSQL connection memory overhead.
- Prisma connection URL configuration:
  ```env
  # Transaction pooler URL (port 6543) for application queries
  DATABASE_URL="postgres://user:password@pooler.db.example.com:6543/focusflow?pgbouncer=true&connection_limit=20"

  # Direct connection URL (port 5432) for running migrations
  DIRECT_URL="postgres://user:password@direct.db.example.com:5432/focusflow"
  ```

### 3.2 Scale-to-Zero & Cold-Start Tolerances
Serverless PostgreSQL instances (e.g. Neon, Cloud SQL Developer Edition) may spin down to zero during inactive periods. The Prisma client service in `apps/api/src/config/prisma.ts` implements exponential backoff retry logic:
- Up to 3 automatic reconnect attempts before throwing a `DatabaseConnectionError`.
- Max connection timeout set to `10000ms`.

---

## 4. Migration & Schema Change Procedures

1. **Local Development:**
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
2. **Production Deployment:**
   Always run deploy migrations without interactive prompts:
   ```bash
   npx prisma migrate deploy
   ```
3. **Zero-Downtime Migration Rule:**
   - Never rename or drop columns in a single step.
   - Step 1: Add new optional column.
   - Step 2: Deploy code writing to both old and new columns.
   - Step 3: Backfill data.
   - Step 4: Drop old column in subsequent release.

---

## 5. Automated Backup & Disaster Recovery (DR)

| Frequency | Backup Type | Retention | Target Storage | RTO / RPO Target |
|---|---|---|---|---|
| Daily (02:00 UTC) | Full pg_dump snapshot | 30 days | Encrypted S3 / Cloud Storage bucket with versioning | RTO < 30m, RPO < 24h |
| Continuous | WAL (Write-Ahead Log) archiving | 7 days | Point-in-time recovery (PITR) storage | RTO < 15m, RPO < 5m |
| Pre-deployment | Manual database snapshot | 7 days | Staged prior to running Prisma migrations | Instant rollback |
