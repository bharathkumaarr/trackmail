package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/models"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TrackingRepository struct {
	pool *pgxpool.Pool
}

func NewTrackingRepository(pool *pgxpool.Pool) *TrackingRepository {
	return &TrackingRepository{pool: pool}
}

func (r *TrackingRepository) Create(ctx context.Context, email *models.TrackedEmail) error {
	query := `
		INSERT INTO tracked_emails (user_id, tracking_token_hash, recipient, subject, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.pool.QueryRow(ctx, query,
		email.UserID, email.TrackingTokenHash, email.Recipient, email.Subject, email.Status,
	).Scan(&email.ID, &email.CreatedAt, &email.UpdatedAt)
}

func (r *TrackingRepository) MarkSent(ctx context.Context, id, userID string, gmailMessageID *string) error {
	query := `
		UPDATE tracked_emails SET status = 'sent', gmail_message_id = $3, updated_at = NOW()
		WHERE id = $1 AND user_id = $2
	`
	tag, err := r.pool.Exec(ctx, query, id, userID, gmailMessageID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *TrackingRepository) GetByTokenHash(ctx context.Context, tokenHash string) (*models.TrackedEmail, error) {
	query := `
		SELECT id, user_id, gmail_message_id, tracking_token_hash, recipient, subject,
		       status, first_opened_at, last_opened_at, open_count, created_at, updated_at
		FROM tracked_emails WHERE tracking_token_hash = $1
	`
	var e models.TrackedEmail
	var gmailMsgID *string
	err := r.pool.QueryRow(ctx, query, tokenHash).Scan(
		&e.ID, &e.UserID, &gmailMsgID, &e.TrackingTokenHash, &e.Recipient, &e.Subject,
		&e.Status, &e.FirstOpenedAt, &e.LastOpenedAt, &e.OpenCount, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	e.GmailMessageID = gmailMsgID
	return &e, nil
}

func (r *TrackingRepository) RecordOpen(ctx context.Context, emailID string, userAgent, ipHash *string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	now := time.Now()
	updateQuery := `
		UPDATE tracked_emails SET
			first_opened_at = COALESCE(first_opened_at, $2),
			last_opened_at = $2,
			open_count = open_count + 1,
			updated_at = $2
		WHERE id = $1
	`
	if _, err := tx.Exec(ctx, updateQuery, emailID, now); err != nil {
		return fmt.Errorf("update aggregates: %w", err)
	}

	eventQuery := `
		INSERT INTO tracking_events (tracked_email_id, event_type, user_agent, ip_hash)
		VALUES ($1, 'open', $2, $3)
	`
	if _, err := tx.Exec(ctx, eventQuery, emailID, userAgent, ipHash); err != nil {
		return fmt.Errorf("insert event: %w", err)
	}

	return tx.Commit(ctx)
}

func (r *TrackingRepository) ListByUser(ctx context.Context, userID string, limit, offset int) ([]models.TrackedEmail, error) {
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	query := `
		SELECT id, user_id, gmail_message_id, tracking_token_hash, recipient, subject,
		       status, first_opened_at, last_opened_at, open_count, created_at, updated_at
		FROM tracked_emails WHERE user_id = $1
		ORDER BY created_at DESC LIMIT $2 OFFSET $3
	`
	rows, err := r.pool.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var emails []models.TrackedEmail
	for rows.Next() {
		var e models.TrackedEmail
		var gmailMsgID *string
		if err := rows.Scan(
			&e.ID, &e.UserID, &gmailMsgID, &e.TrackingTokenHash, &e.Recipient, &e.Subject,
			&e.Status, &e.FirstOpenedAt, &e.LastOpenedAt, &e.OpenCount, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, err
		}
		e.GmailMessageID = gmailMsgID
		emails = append(emails, e)
	}
	return emails, rows.Err()
}

func (r *TrackingRepository) GetByID(ctx context.Context, id, userID string) (*models.TrackedEmail, error) {
	query := `
		SELECT id, user_id, gmail_message_id, tracking_token_hash, recipient, subject,
		       status, first_opened_at, last_opened_at, open_count, created_at, updated_at
		FROM tracked_emails WHERE id = $1 AND user_id = $2
	`
	var e models.TrackedEmail
	var gmailMsgID *string
	err := r.pool.QueryRow(ctx, query, id, userID).Scan(
		&e.ID, &e.UserID, &gmailMsgID, &e.TrackingTokenHash, &e.Recipient, &e.Subject,
		&e.Status, &e.FirstOpenedAt, &e.LastOpenedAt, &e.OpenCount, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	e.GmailMessageID = gmailMsgID
	return &e, nil
}
