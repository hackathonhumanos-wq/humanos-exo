# FOCUSFLOW — Database Architecture (PostgreSQL & Prisma)

## 1. Overview

The database layer uses PostgreSQL with Prisma ORM. The schema is optimized for student productivity, focus tracking, short-form intervention, gamification, and ethical privacy consent.

---

## 2. Entity Relational Model Modules

### A. User & Identity
- **`User`**: Root credential and authentication model. Unique email, hashed password, role (`STUDENT`, `PARENT`, `COUNSELLOR`, `ADMIN`).
- **`Profile`**: Student educational context, avatar, total XP, current gamification level.
- **`Device`**: Registered client devices (Chrome extension, browser, mobile) with unique sync tokens.
- **`PrivacyConsent`**: Explicit student permissions for parent/counsellor aggregate sharing and AI analysis.

### B. Usage & Telemetry
- **`UsageSession`**: Aggregated domain-level active time. Never stores raw query parameters, full URLs, or message content.
- **`ReelDailyStat`**: Daily short-form video transition estimates per platform (`INSTAGRAM_REELS`, `YOUTUBE_SHORTS`, `FACEBOOK_REELS`).
- **`DailySummary`**: Aggregated daily score of focus time, distracting time, estimated reels, and XP earned.

### C. Focus & Intervention
- **`FocusSession`**: Pomodoro, Deep Work, and Exam Prep intervals. Records planned duration, actual duration, and completion status.
- **`FocusGoal`**: Daily habit targets (e.g., minimum 3 hours deep work, maximum 50 reel swipes).
- **`BlockedWebsite`**: List of distracting domains blocked during focus periods via Declarative Net Request.

### D. AI Guidance & Gamification
- **`AIRecommendation`**: Structured recommendations from Gemini/OpenAI covering sleep routine, doomscroll intervention, and study pacing.
- **`XPTransaction`**: Ledger recording XP awards for completed study sessions and zero-reel challenges.
- **`Achievement`**: Earnable badges (e.g., "7-Day Deep Work Streak").
- **`Streak`**: Daily active study streak tracking.

### E. Social & Notifications
- **`StudyGroup`**: Peer study groups sharing aggregate study hours and group streaks.
- **`GroupMember`**: Membership roles (`OWNER`, `ADMIN`, `MEMBER`).
- **`Notification`**: System notifications for goal achievements and reel cap warnings.

---

## 3. Migration & CLI Commands

```powershell
# Generate Prisma Client (Windows PowerShell)
npm run prisma:generate --workspace=@focusflow/api

# Push schema changes to development database
npx prisma db push --schema=apps/api/prisma/schema.prisma

# Launch Prisma Studio to inspect records
npx prisma studio --schema=apps/api/prisma/schema.prisma
```
