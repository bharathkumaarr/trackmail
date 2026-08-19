# Mailtrack — Gmail Email Tracker

Track when your Gmail emails are opened — directly inside Gmail. No separate email client required.

## How It Works

1. Install the Chrome extension
2. Sign in with Google
3. Compose email in Gmail as usual
4. Enable **Track email ✓** in the compose toolbar
5. Click Gmail's normal **Send** button
6. A tracking pixel is injected into the email
7. When the recipient's client fetches the pixel, an open event is recorded
8. View tracking status in the extension popup

### Important Limitation

An "open" indicates the tracking pixel was **fetched** — often via Gmail's image proxy — **not proof** that a human read the email. Gmail may prefetch images, producing false positives and duplicate events.

## Architecture

- **Chrome Extension (Manifest V3)** — Gmail UI integration
- **Go HTTP API** — authentication, tracking, email management
- **PostgreSQL** — data storage ($0 local via Docker)

See [docs/architecture.md](docs/architecture.md) for details.

## Prerequisites

- Go 1.22+
- Node.js 18+
- Docker & Docker Compose
- Google Cloud OAuth credentials (Chrome Extension type)

## Quick Start

### 1. Clone and configure

```bash
git clone https://github.com/bharathkumaarr/trackmail.git
cd trackmail
cp .env.example .env
```

Edit `.env` with your values:
- `JWT_SECRET` — random string
- `IP_HASH_SALT` — random string
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `ENCRYPTION_KEY` — `openssl rand -base64 32`

### 2. Start PostgreSQL

```bash
make docker-up
```

### 3. Run migrations

```bash
make migrate-up
```

### 4. Start backend

```bash
make dev
```

Verify: `curl http://localhost:8080/health`

### 5. Build extension

```bash
cd extension
node scripts/generate-icons.mjs
npm install
npm run build
```

### 6. Load extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `extension/dist/`
4. Copy your extension ID and add to `.env`:
   ```
   CORS_ALLOWED_ORIGINS=chrome-extension://YOUR_EXTENSION_ID
   ```
5. Update `extension/dist/manifest.json` with your `GOOGLE_CLIENT_ID`
6. Reload the extension

### 7. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/):

1. Create OAuth 2.0 credentials (Chrome Extension type)
2. Add your extension ID
3. Enable Google+ API / People API for userinfo

## Development Commands

```bash
make docker-up      # Start PostgreSQL
make docker-down    # Stop PostgreSQL
make migrate-up     # Apply migrations
make migrate-down   # Rollback migrations
make dev            # Run backend server
make test           # Run Go tests
make lint           # Run linters
make build-ext      # Build Chrome extension
```

## API

See [docs/api.md](docs/api.md).

## Project Structure

```
trackmail/
├── backend/          Go API server
├── extension/        Chrome extension (Manifest V3)
├── docs/             Architecture, API, security docs
├── docker-compose.yml
├── Makefile
└── README.md
```

## Cost

**$0 for local development.** PostgreSQL runs in Docker. No Redis, Kafka, or paid services required for MVP.

For production, deploy Go API + PostgreSQL on any VPS or free-tier PostgreSQL provider.

## License

MIT
