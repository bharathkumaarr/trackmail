package models

import "time"

type TrackedEmailStatus string

const (
	StatusPending TrackedEmailStatus = "pending"
	StatusSent      TrackedEmailStatus = "sent"
	StatusFailed    TrackedEmailStatus = "failed"
)

type TrackedEmail struct {
	ID                string             `json:"id"`
	UserID            string             `json:"user_id"`
	GmailMessageID    *string            `json:"gmail_message_id,omitempty"`
	TrackingTokenHash string             `json:"-"`
	Recipient         string             `json:"recipient"`
	Subject           string             `json:"subject"`
	Status            TrackedEmailStatus `json:"status"`
	FirstOpenedAt     *time.Time         `json:"first_opened_at,omitempty"`
	LastOpenedAt      *time.Time         `json:"last_opened_at,omitempty"`
	OpenCount         int                `json:"open_count"`
	CreatedAt         time.Time          `json:"created_at"`
	UpdatedAt         time.Time          `json:"updated_at"`
}

type TrackingEvent struct {
	ID             string    `json:"id"`
	TrackedEmailID string    `json:"tracked_email_id"`
	EventType      string    `json:"event_type"`
	OccurredAt     time.Time `json:"occurred_at"`
	UserAgent      *string   `json:"user_agent,omitempty"`
	IPHash         *string   `json:"-"`
}
