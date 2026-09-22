# Trackmail — Gmail Email Tracker

Know when your Gmail emails are actually opened — directly inside Gmail. No separate email client required. 100% stealth, zero signatures, zero badges.

## How It Works

1. Install the Chrome extension
2. Sign in with Google
3. Compose your email in Gmail as usual
4. Enable **Track email** right beside Gmail's Send button
5. Click Gmail's normal **Send** button
6. When your recipient opens the message, open timestamps and view counts update in real time
7. View tracking status directly in your extension popup

### Important Limitation

An "open" indicates the message was opened in the recipient's mail client. In some cases, corporate spam filters or Gmail's image proxy may prefetch assets, which can produce instant open events.

## Architecture

- **Chrome Extension (Manifest V3)** — Native Gmail compose integration & popup dashboard
- **Go HTTP API** — Authentication, tracking, and email management
- **PostgreSQL** — Fast, robust data storage
- **Landing Page** — Modern Next.js web application

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
- `JWT_SECRET` — random secret string
- `IP_HASH_SALT` — random secret string
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
├── website/          Next.js landing page
├── docs/             Architecture, API, security docs
├── docker-compose.yml
├── Makefile
└── README.md
```

## License

Proprietary / Closed Source. All rights reserved.
