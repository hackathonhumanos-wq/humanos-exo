# FOCUSFLOW — REST API Documentation (v1)

Base URL: `http://localhost:4000/api/v1` (or `http://localhost:3000/api/v1` on unified fullstack server)

---

## 1. System Health

### GET `/api/v1/health`
Verifies backend connectivity, version, and uptime.

**Headers:** None required  
**Query Parameters:** None  

**Response (200 OK):**
```json
{
  "success": true,
  "message": "FOCUSFLOW API is running"
}
```

---

## 2. Authentication (Phase 2 Preview)

### POST `/api/v1/auth/register`
Creates a student or counsellor account with role assignment.

**Payload:**
```json
{
  "email": "student@university.edu",
  "password": "SecurePassword123!",
  "name": "Alex Rivera",
  "role": "STUDENT"
}
```

### POST `/api/v1/auth/login`
Authenticates user and returns JWT access and refresh tokens.

---

## 3. Short-Form Video Telemetry

### POST `/api/v1/telemetry/reels`
Ingests batched estimate events from the Chrome Extension.

**Payload:**
```json
{
  "platform": "INSTAGRAM_REELS",
  "estimatedCount": 18,
  "durationSeconds": 240,
  "detectedAt": "2026-10-31T02:00:00Z",
  "domain": "instagram.com"
}
```

---

## 4. Focus Sessions

### POST `/api/v1/focus/start`
Initiates a Pomodoro, Deep Work, or Exam Prep block.

### PATCH `/api/v1/focus/:id/end`
Records actual completion time and triggers XP allocation.
