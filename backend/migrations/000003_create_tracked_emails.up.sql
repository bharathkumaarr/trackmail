CREATE TYPE tracked_email_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS tracked_emails (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gmail_message_id    TEXT,
    tracking_token_hash TEXT NOT NULL UNIQUE,
    recipient           TEXT NOT NULL,
    subject             TEXT NOT NULL DEFAULT '',
    status              tracked_email_status NOT NULL DEFAULT 'pending',
    first_opened_at     TIMESTAMPTZ,
    last_opened_at      TIMESTAMPTZ,
    open_count          INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tracked_emails_user_id ON tracked_emails (user_id);
CREATE INDEX idx_tracked_emails_user_created ON tracked_emails (user_id, created_at DESC);
CREATE INDEX idx_tracked_emails_token_hash ON tracked_emails (tracking_token_hash);
