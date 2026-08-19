package middleware

import (
	"net/http"
	"strings"

	"github.com/bharathkumaarr/trackmail/backend/internal/auth"
	"github.com/bharathkumaarr/trackmail/backend/internal/common"
)

func Auth(authSvc *auth.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
				return
			}
			token := strings.TrimPrefix(authHeader, "Bearer ")
			userID, email, err := authSvc.ValidateJWT(token)
			if err != nil {
				common.WriteError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token")
				return
			}
			ctx := common.WithUserID(r.Context(), userID)
			r = r.WithContext(ctx)
			r.Header.Set("X-User-Email", email)
			next.ServeHTTP(w, r)
		})
	}
}
