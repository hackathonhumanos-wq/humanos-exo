# FOCUSFLOW — Privacy, Ethics & Student Safety Audit (PRIVACY_AND_SAFETY_AUDIT.md)

**Audit Date:** May 2025  
**Version:** 1.0.0-rc  
**Target Standards:** Student Privacy Pledge, Family Educational Rights and Privacy Act (FERPA principles), GDPR Article 25 (Data Protection by Design & Default)

---

## 1. Core Ethical Pillars

FOCUSFLOW was founded to counter addictive digital designs and help students regain autonomy over their study habits. The architecture strictly adheres to three non-negotiable principles:

1. **Non-Intrusive Telemetry:** We never record screen video, take screenshots, log keystrokes, intercept personal messages, or harvest private browsing histories.
2. **Transparent Heuristics:** Counts of short-form videos (Instagram Reels, YouTube Shorts, Facebook Reels) are explicitly labeled as **estimated transitions**, never as exact private API view counts.
3. **Student Consent First:** No student data is shared with parents, guardians, schools, or university counsellors without explicit, informed, and revocable student consent.

---

## 2. Short-Form Video Tracking: Technical Ethics

### 2.1 The Distinction: Transitions vs Views
- **Third-Party Private APIs:** FOCUSFLOW does not possess or claim access to internal Meta/Instagram or YouTube video view telemetry APIs.
- **Client-Side Heuristic:** The Chrome Extension observes single-page application URL route changes (e.g. matching `instagram.com/reels/*` or `youtube.com/shorts/*`).
- **Cooldown & Debouncing:** A strict 2,500ms cooldown filter prevents accidental rapid route bounces or DOM re-renders from inflating counts.
- **User-Facing Disclaimer:** The application transparently displays the notice across all dashboards:
  > *"Ethical Telemetry Notice: Counts represent estimated URL route transitions detected non-intrusively in your browser. FOCUSFLOW never accesses private account data, messages, keystrokes, or exact watch-time APIs."*

---

## 3. Student Consent & Multi-Role Sharing

### 3.1 The `PrivacyConsent` Model
Every student account maintains a granular privacy preference record:
- `consentShareWithParent` (default: `false`): Explicit toggle allowing parents to view daily study focus hours and streak counts.
- `consentShareWithCounsellor` (default: `false`): Explicit toggle allowing campus academic advisors to include student data in aggregate cohort health analyses.
- `consentExtensionTelemetry` (default: `true`): Allows local browser extension to send daily aggregate counts to the student's personal dashboard.
- `consentAiProductivityAnalysis` (default: `true`): Allows server-side AI Coach to generate personalized study plans.

### 3.2 Revocation Policy
Students can revoke sharing permissions at any moment from `SettingsPage` (`/settings`). Revocation takes effect immediately: subsequent parent queries return a blank or consent-required placeholder.

---

## 4. Institutional K-Anonymity Safeguards

When universities, colleges, or high schools license FOCUSFLOW for campus student support:
1. **Minimum Cohort Size ($k \ge 5$):** Counsellors can only view aggregated metrics (e.g., average weekly focus minutes, wellbeing health score) for student cohorts of 5 or more consented students.
2. **Automatic Redaction:** If a cohort contains fewer than 5 opted-in members, the endpoint `/api/v1/institutions/cohorts/:id` automatically redacts numerical metrics and displays:
   > *"DATA REDACTED FOR STUDENT PRIVACY: Minimum cohort size of 5 opted-in students required to reveal aggregate statistics."*
3. **No Individual Dean/Counsellor Drill-Down:** Individual student records cannot be opened from the Institutional Portal.

---

## 5. Data Minimization & Retention

| Data Category | Data Stored | Retention Period | Deletion Mechanism |
|---|---|---|---|
| Focus Sessions | Start time, planned duration, actual duration, mode, optional notes | 12 months (or until user requests deletion) | Cascade delete on account removal |
| Distraction Telemetry | Daily aggregate transition counts by platform (Instagram, YouTube) | 90 days rolling window; older records rolled into weekly sums | Automated scheduled cleanup cron |
| Browsing URLs | **NEVER STORED.** Only domain category matched in memory. | 0 seconds (in-memory only) | Discarded immediately after incrementing counter |
| Chat & Reflection Prompts | Text notes entered during AI Coach or reflection check-ins | Encrypted at rest; deleted upon account reset | User-initiated hard purge in settings |
| Payment & Billing | Razorpay order IDs and subscription tier status | Retained per tax regulations (7 years) | Handled by PCI-DSS certified gateway |

---

## 6. Audit Conclusion
FOCUSFLOW complies with modern student privacy expectations and sets an industry benchmark for ethical digital wellbeing software by replacing intrusive surveillance with transparent, consent-driven productivity coaching.
