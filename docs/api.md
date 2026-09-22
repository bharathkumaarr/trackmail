# Trackmail API

Base URL: `http://localhost:8080/api/v1`

## Authentication

All authenticated endpoints require:

```
Authorization: Bearer <jwt_token>
```

Obtain a token via `POST /auth/google` with a Google OAuth access token or authorization code.

---

## Endpoints

### POST /auth/google

Authenticate with Google OAuth.

**Request:**
```json
{
  "access_token": "google-access-token"
}
```
Or:
```json
{
  "code": "authorization-code"
}
```
Or:
```json
{
  "id_token": "google-id-token"
}
```

**Response (200):**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com"
  }
}
```

**Errors:** `401 AUTH_FAILED`

---

### GET /auth/me

Get current authenticated user.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@gmail.com"
}
```

---

### POST /tracked-emails

Create a tracked email and receive tracking pixel URL.

**Request:**
```json
{
  "recipient": "john@example.com",
  "subject": "Project Update"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "tracking_url": "http://localhost:8080/api/v1/track/open/TOKEN",
  "pixel_html": "<img src=\"...\" width=\"1\" height=\"1\" style=\"display:none\" alt=\"\" />"
}
```

---

### POST /tracked-emails/:id/sent

Mark a tracked email as sent.

**Request:**
```json
{
  "gmail_message_id": "optional-gmail-id"
}
```

**Response (200):**
```json
{
  "status": "sent"
}
```

---

### GET /tracked-emails

List tracked emails for the authenticated user.

**Query params:** `limit` (default 50, max 100), `offset`

**Response (200):**
```json
{
  "emails": [
    {
      "id": "uuid",
      "recipient": "john@example.com",
      "subject": "Project Update",
      "status": "sent",
      "first_opened_at": "2026-01-15T10:42:00Z",
      "last_opened_at": "2026-01-15T10:42:00Z",
      "open_count": 1,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

### GET /tracked-emails/:id

Get a single tracked email.

---

### GET /track/open/:token

Public tracking pixel endpoint. Returns a transparent 1×1 GIF.

**No authentication required.**

**Rate limit:** Configurable per IP (default 10 req/s, burst 20).

**Important:** An open event indicates the tracking pixel was fetched — not proof a human read the email. Gmail may proxy/prefetch images.

Always returns the pixel image regardless of token validity (no information leakage).

---

## Error Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable message"
  }
}
```

**Status codes:**
- `400` — Invalid request
- `401` — Unauthenticated
- `404` — Not found
- `429` — Rate limited
- `500` — Internal error

---

## Health

- `GET /health` — Server is running
- `GET /ready` — Server + database are ready
