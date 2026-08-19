package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/bharathkumaarr/trackmail/backend/internal/middleware"
)

func TestIPRateLimiterMiddleware(t *testing.T) {
	limiter := middleware.NewIPRateLimiter(1000, 5)
	handler := limiter.Middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	for i := 0; i < 5; i++ {
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		req.RemoteAddr = "127.0.0.1:1234"
		rec := httptest.NewRecorder()
		handler.ServeHTTP(rec, req)
		if rec.Code != http.StatusOK {
			t.Errorf("request %d: expected 200, got %d", i, rec.Code)
		}
	}
}
