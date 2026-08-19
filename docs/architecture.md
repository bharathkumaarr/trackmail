# Architecture

## Overview

Mailtrack is a Gmail email open-tracking system composed of a **Chrome Extension (Manifest V3)** and a **Go HTTP API** backed by **PostgreSQL**. Users continue composing and sending email in Gmail; the extension adds a "Track email" toggle and injects a tracking pixel when enabled.

```
┌─────────────────┐     OAuth / API      ┌──────────────────┐
│ Chrome Extension│ ◄──────────────────► │   Go API Server  │
│  (Gmail UI)     │                      │   (stateless)    │
└────────┬────────┘                      └────────┬─────────┘
         │ inject pixel                           │
         │ on send                                  │ SQL
         ▼                                          ▼
┌─────────────────┐                      ┌──────────────────┐
│  Gmail (native) │                      │   PostgreSQL     │
│  send pipeline  │                      └──────────────────┘
└────────┬────────┘
         │ email with pixel
         ▼
┌─────────────────┐     GET /track/open  ┌──────────────────┐
│ Recipient client│ ───────────────────► │  Tracking endpoint│
└─────────────────┘                      └──────────────────┘
```

## Core Design Decisions

### 1. Native Gmail Send (not a separate email client)

**Decision:** Intercept the send button click, prepare tracking metadata, inject a 1×1 tracking pixel into the compose body, then allow Gmail's native send to proceed.

**Why:** Gmail supports rich text, attachments, signatures, scheduled send, aliases, CC/BCC, and more. Reimplementing send via Gmail API would break or duplicate these features.

**Tradeoff:** DOM selectors may break when Gmail updates. All Gmail-specific logic lives in `extension/src/gmail/` behind a `GmailAdapter` interface.

### 2. Tracking Pixel (not Gmail open API)

Gmail does not expose `gmail.wasOpened(messageId)`. Open tracking uses:

```html
<img src="https://TRACKING_DOMAIN/api/v1/track/open/{token}" width="1" height="1" style="display:none" alt="" />
```

**Limitation:** An "open" indicates the tracking resource was fetched — often via Gmail's image proxy — not proof a human read the email. Gmail may prefetch images. Documented in README and code.

### 3. Tracking Tokens

- 32 cryptographically random bytes → base64url (~43 chars)
- Stored as SHA-256 hash in `tracked_emails.tracking_token_hash`
- Raw token never stored; returned once at creation for pixel URL
- Does not encode user ID, email, or database ID

### 4. Authentication Flow

```
Extension → chrome.identity.launchWebAuthFlow (Google OAuth)
         → Backend POST /api/v1/auth/google
         → Backend stores encrypted OAuth tokens
         → Backend returns application JWT (HttpOnly not usable in extension; stored via chrome.storage.session)
```

Scopes (minimum):
- `openid email profile` — user identity
- `https://www.googleapis.com/auth/gmail.send` — not required for MVP (native send)
- No Gmail read scope for MVP — we do not read mailbox via API

For MVP, identity scope is sufficient since send happens natively in Gmail.

### 5. Open Event Handling

The `/api/v1/track/open/{token}` endpoint:

1. Validates token format
2. Hashes token, looks up `tracked_emails`
3. Returns transparent GIF regardless (no information leakage)
4. If found: deduplicates within 60s window (same token + IP hash)
5. Updates aggregates: `first_opened_at`, `last_opened_at`, `open_count`
6. Optionally inserts `tracking_events` (with retention in mind)

**Performance:** Single UPDATE query with RETURNING; no Gmail API calls; no queues.

### 6. Rate Limiting

In-memory token-bucket per IP hash on tracking endpoint. Documented: multi-instance deployments need shared rate limiter (Redis or similar) later.

### 7. Database

PostgreSQL only. No Redis, Kafka, or paid services for MVP.

- Local: Docker Compose
- Production: any PostgreSQL host (free tier VPS, Neon free tier, etc.)

Repository pattern isolates SQL from business logic.

### 8. Extension Architecture

```
extension/src/
├── gmail/           # GmailAdapter — all DOM selectors here
├── content/         # Content script entry
├── background/      # Service worker
├── popup/           # Extension popup UI
├── services/api/    # Centralized API client
├── storage/         # chrome.storage wrappers
└── types/           # Shared TypeScript types
```

Compose detection uses `MutationObserver` on Gmail's compose container — not polling.

### 9. Security

- OAuth tokens encrypted at rest (AES-256-GCM with `ENCRYPTION_KEY`)
- Tracking tokens hashed
- IP addresses hashed (SHA-256 + salt), not stored raw
- CORS restricted to extension origin + configured origins
- Rate limiting on public endpoints
- No secrets in logs or extension bundle (except public client ID)

### 10. Scalability Path

Current: single Go instance + PostgreSQL + in-memory rate limiter.

Future horizontal scale:
- Stateless Go API behind load balancer
- PostgreSQL with connection pooling
- Shared rate limiter (Redis)
- Read replicas if needed

No architectural rewrite required — modules are already separated.

## Module Boundaries (Backend)

| Module | Responsibility |
|--------|----------------|
| `config` | Environment configuration |
| `database` | Connection pool, migrations runner |
| `middleware` | Logging, CORS, rate limit, auth, request ID |
| `auth` | Google OAuth, JWT sessions, encryption |
| `tracking` | Token generation, open handler, deduplication |
| `emails` | Tracked email CRUD |
| `users` | User management |
| `events` | Tracking event persistence |

## Gmail DOM Assumptions

Centralized in `extension/src/gmail/selectors.ts`:

- Compose dialogs: `[role="dialog"]` containing send button
- Send button: `[role="button"][aria-label*="Send"]` (locale-dependent; documented)
- Recipients: `[aria-label="To"]` input
- Subject: `input[name="subjectbox"]`
- Body: `[aria-label="Message Body"]` contenteditable or `[g_editable="true"]`

These selectors are the primary maintenance surface when Gmail updates.

## Event Retention

MVP: aggregate fields on `tracked_emails` are primary; individual `tracking_events` inserted with deduplication. Future: retention policy job to prune events older than N days.

## Deployment

```
Internet → Go API (PORT) → PostgreSQL
Extension → API (HTTPS)
Recipients → GET /api/v1/track/open/{token}
```

Tracking domain should be a stable public URL (ngrok for dev, VPS/domain for prod).
