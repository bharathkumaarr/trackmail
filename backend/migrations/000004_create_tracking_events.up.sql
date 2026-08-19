CREATE TYPE tracking_event_type AS ENUM ('open');

CREATE TABLE IF NOT EXISTS tracking_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracked_email_id UUID NOT NULL REFERENCES tracked_emails(id) ON DELETE CASCADE,
    event_type      tracking_event_type NOT NULL DEFAULT 'open',
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent      TEXT,
    ip_hash         TEXT
);

CREATE INDEX idx_tracking_events_email_occurred ON tracking_events (tracked_email_id, occurred_at DESC);
