package handlers

import (
	"net/http"

	"github.com/bharathkumaarr/trackmail/backend/internal/common"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/services"
	"github.com/go-chi/chi/v5"
)

type OpenHandler struct {
	service *services.TrackingService
}

func NewOpenHandler(service *services.TrackingService) *OpenHandler {
	return &OpenHandler{service: service}
}

// HandleOpen records an email open event and returns a transparent 1x1 GIF.
//
// IMPORTANT: An open event indicates the tracking pixel was fetched — often via
// Gmail's image proxy — NOT proof that a human read the email. Gmail may prefetch
// images, and duplicate requests from proxies are deduplicated within a short window.
func (h *OpenHandler) HandleOpen(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")

	// Always return the pixel to avoid leaking whether a token is valid.
	w.Header().Set("Content-Type", "image/gif")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	w.Header().Set("Pragma", "no-cache")

	if common.ValidateTokenFormat(token) {
		ip := r.RemoteAddr
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			ip = xff
		}
		_ = h.service.RecordOpen(r.Context(), token, r.UserAgent(), ip)
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(common.TransparentGIF)
}
