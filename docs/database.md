# Database Schema

## users

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| google_user_id | TEXT UNIQUE | Google `sub` claim |
| email | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

## gmail_accounts

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| google_account_id | TEXT | |
| email | TEXT | |
| encrypted_access_token | BYTEA | AES-256-GCM encrypted |
| encrypted_refresh_token | BYTEA | AES-256-GCM encrypted |
| token_expires_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Unique constraint: `(user_id, google_account_id)`

## tracked_emails

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → users | |
| gmail_message_id | TEXT | Optional, set after send |
| tracking_token_hash | TEXT UNIQUE | SHA-256 of raw token |
| recipient | TEXT | |
| subject | TEXT | |
| status | ENUM | pending, sent, failed |
| first_opened_at | TIMESTAMPTZ | Aggregate |
| last_opened_at | TIMESTAMPTZ | Aggregate |
| open_count | INT | Aggregate, default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Indexes:
- `user_id` — list by user
- `(user_id, created_at DESC)` — paginated list
- `tracking_token_hash` — open endpoint lookup

## tracking_events

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| tracked_email_id | UUID FK → tracked_emails | |
| event_type | ENUM | open |
| occurred_at | TIMESTAMPTZ | |
| user_agent | TEXT | Optional |
| ip_hash | TEXT | SHA-256(salt + IP), not raw IP |

Index: `(tracked_email_id, occurred_at DESC)`

## Event Retention

MVP stores individual events with deduplication (60s window per token+IP). Future: retention policy job to prune events older than N days. Aggregates on `tracked_emails` are the primary analytics source.
