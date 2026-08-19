# Security

## Authentication

- Google OAuth 2.0 for user identity (no password storage)
- Application JWT (HS256) for API authentication
- Google OAuth tokens encrypted at rest when stored (AES-256-GCM)
- Extension uses `chrome.identity.getAuthToken` — access token sent to backend once, backend returns app JWT

## Tracking Tokens

- 32-byte cryptographically random tokens (base64url)
- Stored as SHA-256 hash only
- Raw token returned once at creation for pixel URL
- Open endpoint never reveals whether token is valid

## Privacy

- Raw IP addresses are NOT stored
- IP hashed with application salt: `SHA-256(salt + IP)`
- Email bodies are NOT stored
- User agent stored optionally for debugging

## Rate Limiting

- In-memory per-IP rate limiter on `/track/open/:token`
- Documented limitation: single-instance only; distributed deployments need shared limiter

## CORS

- Restricted to configured origins + `chrome-extension://` prefixes

## Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- Tracking pixel: `Cache-Control: no-store, no-cache`

## Input Validation

- Token format validated before database lookup
- Request body size limited to 1MB
- Parameterized SQL queries throughout

## Secrets

- Never committed to repository
- `.env` for local development
- `ENCRYPTION_KEY`, `JWT_SECRET`, `IP_HASH_SALT` required in production

## Logging

Never log:
- OAuth tokens
- Tracking tokens
- Email bodies
- Raw IP addresses

## Known Limitations

- Email open tracking via pixel is not proof of human read
- Gmail image proxy may cause false positives and duplicate events
- Gmail DOM integration may break on Gmail updates
