# FOCUSFLOW — Security & Privacy Architecture

## 1. Ethical Student Data Governance

1. **Non-Intrusive Estimation**:
   - Short-form video transitions are strictly **estimates** detected from URL navigation events or visible feed container changes.
   - Public platform APIs do not provide raw personal reel consumption numbers; our system never claims exact platform counts.
   - We **never** record keystrokes, screen recordings, private messages, user comments, or page text.

2. **Domain-Level Aggregation**:
   - Web usage is stored exclusively at the domain level (`instagram.com`, `youtube.com`).
   - Deep query strings, authentication tokens, and specific video IDs are stripped prior to database storage.

3. **Student Consent Primacy**:
   - Data sharing with parents or campus counsellors requires explicit, affirmative student consent in `PrivacyConsent`.
   - Consent can be revoked instantly at any time.

---

## 2. API & Network Hardening

- **Helmet Security Headers**: Configured to protect against clickjacking, MIME sniffing, and cross-site scripting.
- **Strict CORS Policy**: Whitelists trusted web origins and Chrome extension protocol IDs.
- **Zero Exposed Keys**: LLM API keys (Gemini / OpenAI) reside strictly on the server-side proxy; client applications never bundle API keys.
- **Input Sanitization**: All endpoint payloads are validated against Zod schemas.
