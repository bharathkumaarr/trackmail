package httpx

import (
	"context"
	"net/http"

	"github.com/bharathkumaarr/trackmail/backend/internal/auth"
	"github.com/bharathkumaarr/trackmail/backend/internal/config"
	"github.com/bharathkumaarr/trackmail/backend/internal/database"
	"github.com/bharathkumaarr/trackmail/backend/internal/middleware"
	trackinghandlers "github.com/bharathkumaarr/trackmail/backend/internal/tracking/handlers"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/repositories"
	"github.com/bharathkumaarr/trackmail/backend/internal/tracking/services"
	userrepo "github.com/bharathkumaarr/trackmail/backend/internal/users/repositories"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"log/slog"
)

type Server struct {
	router *chi.Mux
	pool   *pgxpool.Pool
	log    *slog.Logger
}

func NewServer(cfg *config.Config, pool *pgxpool.Pool, log *slog.Logger) *Server {
	userRepository := userrepo.NewUserRepository(pool)
	trackingRepository := repositories.NewTrackingRepository(pool)
	authSvc := auth.NewService(cfg, userRepository)
	dedupe := middleware.NewDedupeCache(cfg.OpenDedupeWindow)
	trackingSvc := services.NewTrackingService(trackingRepository, cfg, dedupe)

	openHandler := trackinghandlers.NewOpenHandler(trackingSvc)
	emailsHandler := trackinghandlers.NewEmailsHandler(trackingSvc)
	authHandler := auth.NewAuthHandler(authSvc)

	trackingRateLimiter := middleware.NewIPRateLimiter(cfg.RateLimitTrackingRPS, cfg.RateLimitTrackingBurst)

	r := chi.NewRouter()
	r.Use(chimiddleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.Logging(log))
	r.Use(middleware.SecureHeaders)
	r.Use(middleware.CORS(cfg.CORSAllowedOrigins))
	r.Use(middleware.MaxBodySize(1 << 20)) // 1MB

	r.Get("/health", healthHandler)
	r.Get("/ready", readyHandler(pool))

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/auth/google", authHandler.GoogleAuth)
		r.Get("/auth/google/callback", authHandler.GoogleCallback)

		r.Group(func(r chi.Router) {
			r.Use(middleware.Auth(authSvc))
			r.Get("/auth/me", authHandler.Me)
			r.Post("/tracked-emails", emailsHandler.Create)
			r.Get("/tracked-emails", emailsHandler.List)
			r.Get("/tracked-emails/{id}", emailsHandler.Get)
			r.Post("/tracked-emails/{id}/sent", emailsHandler.MarkSent)
		})

		r.With(trackingRateLimiter.Middleware).Get("/track/open/{token}", openHandler.HandleOpen)
	})

	return &Server{router: r, pool: pool, log: log}
}

func (s *Server) Handler() http.Handler {
	return s.router
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}

func readyHandler(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := database.HealthCheck(r.Context(), pool); err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			_, _ = w.Write([]byte(`{"status":"not ready"}`))
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ready"}`))
	}
}
func (s *Server) Shutdown(ctx context.Context) {
	s.pool.Close()
}
