package auth

import (
	"encoding/json"
	"net/http"

	"github.com/bharathkumaarr/trackmail/backend/internal/common"
)

type AuthHandler struct {
	auth *Service
}

func NewAuthHandler(authSvc *Service) *AuthHandler {
	return &AuthHandler{auth: authSvc}
}

type googleAuthRequest struct {
	IDToken     string `json:"id_token"`
	Code        string `json:"code"`
	AccessToken string `json:"access_token"`
}

func (h *AuthHandler) GoogleAuth(w http.ResponseWriter, r *http.Request) {
	var req googleAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		common.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid JSON body")
		return
	}

	var result *AuthResult
	var err error

	switch {
	case req.AccessToken != "":
		result, err = h.auth.ExchangeAccessToken(r.Context(), req.AccessToken)
	case req.IDToken != "":
		result, err = h.auth.ExchangeIDToken(r.Context(), req.IDToken)
	case req.Code != "":
		result, err = h.auth.ExchangeCode(r.Context(), req.Code)
	default:
		common.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST", "id_token or code required")
		return
	}

	if err != nil {
		common.WriteError(w, http.StatusUnauthorized, "AUTH_FAILED", "Authentication failed")
		return
	}

	common.WriteJSON(w, http.StatusOK, result)
}

func (h *AuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		common.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST", "Missing authorization code")
		return
	}

	result, err := h.auth.ExchangeCode(r.Context(), code)
	if err != nil {
		common.WriteError(w, http.StatusUnauthorized, "AUTH_FAILED", "Authentication failed")
		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`<!DOCTYPE html><html><body><script>
		if (window.opener) {
			window.opener.postMessage({ type: 'MAILTRACK_AUTH', token: '` + result.Token + `' }, '*');
			window.close();
		} else {
			document.body.innerText = 'Authentication successful. You may close this window.';
		}
	</script></body></html>`))
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := common.UserIDFromContext(r.Context())
	if !ok {
		common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}
	email := r.Header.Get("X-User-Email")
	common.WriteJSON(w, http.StatusOK, map[string]string{"id": userID, "email": email})
}
