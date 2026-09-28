# Cybersecurity & Prompt Injection Defense Architecture

## Executive Security Model

Financial intelligence platforms process untrusted text ingested from external RSS and web articles. This introduces the risk of **Indirect Prompt Injection**, where third-party articles conceal instructions designed to manipulate the LLM.

Our platform implements an end-to-end defense matrix aligned with OWASP Top 10 for Large Language Model Applications (LLM01: Prompt Injection, LLM02: Sensitive Information Disclosure, LLM06: Excessive Agency).

---

## 4-Stage Prompt Injection Defense Pipeline

```
[Raw User Query / Article Text]
            │
            ▼
┌───────────────────────────────────────────────┐
│ 1. Steganographic Sanitization                 │
│ - Strip \u200B-\u200D, \uFEFF zero-width spaces│
│ - Normalize Unicode via NFKC                  │
│ - Remove non-printable control characters      │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ 2. Adversarial Pattern & Heuristic Scanning   │
│ - Regex filters for system override phrases   │
│ - Rejects "ignore previous instructions"      │
│ - Token budget cap (500 chars for questions)   │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ 3. Rigid Context Encapsulation                │
│ - Rigid delimiter: === BEGIN UNTRUSTED CONTEXT│
│ - Scopes context strictly to financial data   │
│ - Prevents instructional privilege escalation │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│ 4. Deterministic Schema Enforcement           │
│ - JSON Mode enforced at LLM inference         │
│ - Pydantic type validation on returned payload│
│ - Out-of-scope flag (is_in_scope: false)      │
└───────────────────────────────────────────────┘
```

---

## Adversarial Patterns Blocked

The middleware rejects inputs matching adversarial patterns, including:

* `ignore (all) (previous|prior|above) (instructions|prompts|rules)`
* `disregard (all) previous instructions`
* `you are now (unrestricted|dan|developer mode)`
* `system (override|prompt|directive|execution)`
* `print (the) (system prompt|developer instructions)`
* `reveal system prompt`
* `execute (python|bash|cmd|powershell|sql)`
* HTML script tags `<script>...</script>` and `javascript:` URIs

---

## Authentication & Authorization Security

* **Password Hashing**: Bcrypt with work factor of 12 rounds and automatic unique salt generation. Plaintext passwords never hit the database.
* **JWT Access Tokens**: Short-lived (15–60 minutes) HS256 tokens carrying minimal claims (`sub`, `email`, `role`).
* **Refresh Token Rotation**: 7-day refresh tokens securely exchanged for fresh access tokens.
* **Rate Limiting**: Sliding-window in-memory rate limiter per IP address (120 requests / 60 seconds) with `429 Too Many Requests` status codes.
* **SQL Injection Protection**: 100% of queries use SQLAlchemy parameter binding; no raw SQL string concatenation.
* **XSS Protection**: React automatic HTML escaping combined with strict Nginx Content-Security-Policy headers.
