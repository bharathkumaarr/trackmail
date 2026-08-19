-- gmail_accounts: OAuth credentials per linked Google account
CREATE TABLE IF NOT EXISTS gmail_accounts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    google_account_id       TEXT NOT NULL,
    email                   TEXT NOT NULL,
    encrypted_access_token  BYTEA,
    encrypted_refresh_token BYTEA,
    token_expires_at        TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, google_account_id)
);

CREATE INDEX idx_gmail_accounts_user_id ON gmail_accounts (user_id);
