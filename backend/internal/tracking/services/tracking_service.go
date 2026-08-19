package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/bharathkumaarr/trackmail/backend/internal/common"
	"github.com/bharathkumaarr/trackmail/backend/internal/config"
	"github.com/bharathkumaarr/trackmail/backend/internal/middleware"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/models"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/repositories"
)

type TrackingService struct {
	repo          *repositories.TrackingRepository
	cfg           *config.Config
	dedupe        *middleware.DedupeCache
}

func NewTrackingService(repo *repositories.TrackingRepository, cfg *config.Config, dedupe *middleware.DedupeCache) *TrackingService {
	return &TrackingService{repo: repo, cfg: cfg, dedupe: dedupe}
}

type CreateTrackedEmailInput struct {
	UserID    string
	Recipient string
	Subject   string
}

type CreateTrackedEmailResult struct {
	ID          string `json:"id"`
	TrackingURL string `json:"tracking_url"`
	PixelHTML   string `json:"pixel_html"`
}

func (s *TrackingService) CreateTrackedEmail(ctx context.Context, input CreateTrackedEmailInput) (*CreateTrackedEmailResult, error) {
	rawToken, tokenHash, err := common.GenerateTrackingToken()
	if err != nil {
		return nil, err
	}

	email := &models.TrackedEmail{
		UserID:            input.UserID,
		TrackingTokenHash: tokenHash,
		Recipient:         strings.TrimSpace(input.Recipient),
		Subject:           strings.TrimSpace(input.Subject),
		Status:            models.StatusPending,
	}
	if email.Recipient == "" {
		return nil, fmt.Errorf("recipient is required")
	}

	if err := s.repo.Create(ctx, email); err != nil {
		return nil, fmt.Errorf("create tracked email: %w", err)
	}

	trackingURL := fmt.Sprintf("%s/api/v1/track/open/%s", strings.TrimRight(s.cfg.TrackingDomain, "/"), rawToken)
	pixelHTML := fmt.Sprintf(`<img src="%s" width="1" height="1" style="display:none" alt="" />`, trackingURL)

	return &CreateTrackedEmailResult{
		ID:          email.ID,
		TrackingURL: trackingURL,
		PixelHTML:   pixelHTML,
	}, nil
}

func (s *TrackingService) MarkSent(ctx context.Context, id, userID string, gmailMessageID *string) error {
	return s.repo.MarkSent(ctx, id, userID, gmailMessageID)
}

func (s *TrackingService) RecordOpen(ctx context.Context, token, userAgent, clientIP string) error {
	if !common.ValidateTokenFormat(token) {
		return nil // silently ignore malformed tokens
	}

	tokenHash := common.HashToken(token)
	email, err := s.repo.GetByTokenHash(ctx, tokenHash)
	if err != nil {
		return nil // unknown token — no leak
	}

	ipHash := common.HashIP(clientIP, s.cfg.IPHashSalt)
	dedupeKey := tokenHash + ":" + ipHash
	if !s.dedupe.ShouldRecord(dedupeKey) {
		return nil
	}

	var ua *string
	if userAgent != "" {
		ua = &userAgent
	}
	ipH := ipHash
	return s.repo.RecordOpen(ctx, email.ID, ua, &ipH)
}

func (s *TrackingService) ListByUser(ctx context.Context, userID string, limit, offset int) ([]models.TrackedEmail, error) {
	return s.repo.ListByUser(ctx, userID, limit, offset)
}

func (s *TrackingService) GetByID(ctx context.Context, id, userID string) (*models.TrackedEmail, error) {
	return s.repo.GetByID(ctx, id, userID)
}
