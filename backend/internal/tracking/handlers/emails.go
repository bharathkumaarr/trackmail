package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/bharathkumaarr/trackmail/backend/internal/common"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/models"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/services"
	"github.com/go-chi/chi/v5"
)

type EmailsHandler struct {
	service *services.TrackingService
}

func NewEmailsHandler(service *services.TrackingService) *EmailsHandler {
	return &EmailsHandler{service: service}
}

type createEmailRequest struct {
	Recipient string `json:"recipient"`
	Subject   string `json:"subject"`
}

type markSentRequest struct {
	GmailMessageID *string `json:"gmail_message_id"`
}

func (h *EmailsHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := common.UserIDFromContext(r.Context())
	if !ok {
		common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	var req createEmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		common.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid JSON body")
		return
	}

	result, err := h.service.CreateTrackedEmail(r.Context(), services.CreateTrackedEmailInput{
		UserID:    userID,
		Recipient: req.Recipient,
		Subject:   req.Subject,
	})
	if err != nil {
		common.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		return
	}

	common.WriteJSON(w, http.StatusCreated, result)
}

func (h *EmailsHandler) MarkSent(w http.ResponseWriter, r *http.Request) {
	userID, ok := common.UserIDFromContext(r.Context())
	if !ok {
		common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	id := chi.URLParam(r, "id")
	var req markSentRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	if err := h.service.MarkSent(r.Context(), id, userID, req.GmailMessageID); err != nil {
		common.WriteError(w, http.StatusNotFound, "NOT_FOUND", "Tracked email not found")
		return
	}

	common.WriteJSON(w, http.StatusOK, map[string]string{"status": "sent"})
}

func (h *EmailsHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := common.UserIDFromContext(r.Context())
	if !ok {
		common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))

	emails, err := h.service.ListByUser(r.Context(), userID, limit, offset)
	if err != nil {
		common.WriteError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to list emails")
		return
	}
	if emails == nil {
		emails = []models.TrackedEmail{}
	}

	common.WriteJSON(w, http.StatusOK, map[string]any{"emails": emails})
}

func (h *EmailsHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID, ok := common.UserIDFromContext(r.Context())
	if !ok {
		common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	email, err := h.service.GetByID(r.Context(), chi.URLParam(r, "id"), userID)
	if err != nil {
		common.WriteError(w, http.StatusNotFound, "NOT_FOUND", "Tracked email not found")
		return
	}

	common.WriteJSON(w, http.StatusOK, email)
}
