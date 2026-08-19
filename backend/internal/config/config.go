package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv              string
	Port                string
	DatabaseURL         string
	GoogleClientID      string
	GoogleClientSecret  string
	GoogleRedirectURI   string
	JWTSecret           string
	TrackingDomain      string
	EncryptionKey       []byte
	CORSAllowedOrigins  []string
	IPHashSalt          string
	RateLimitTrackingRPS float64
	RateLimitTrackingBurst int
	LogLevel            string
	JWTExpiry           time.Duration
	OpenDedupeWindow    time.Duration
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{
		AppEnv:              getEnv("APP_ENV", "development"),
		Port:                getEnv("PORT", "8080"),
		DatabaseURL:         os.Getenv("DATABASE_URL"),
		GoogleClientID:      os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret:  os.Getenv("GOOGLE_CLIENT_SECRET"),
		GoogleRedirectURI:   getEnv("GOOGLE_REDIRECT_URI", "http://localhost:8080/api/v1/auth/google/callback"),
		JWTSecret:           os.Getenv("JWT_SECRET"),
		TrackingDomain:      getEnv("TRACKING_DOMAIN", "http://localhost:8080"),
		IPHashSalt:          os.Getenv("IP_HASH_SALT"),
		RateLimitTrackingRPS: getEnvFloat("RATE_LIMIT_TRACKING_RPS", 10),
		RateLimitTrackingBurst: getEnvInt("RATE_LIMIT_TRACKING_BURST", 20),
		LogLevel:            getEnv("LOG_LEVEL", "info"),
		JWTExpiry:           7 * 24 * time.Hour,
		OpenDedupeWindow:    60 * time.Second,
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}
	if cfg.IPHashSalt == "" {
		return nil, fmt.Errorf("IP_HASH_SALT is required")
	}

	encKey := os.Getenv("ENCRYPTION_KEY")
	if encKey != "" {
		cfg.EncryptionKey = []byte(encKey)
	}

	origins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if origins != "" {
		cfg.CORSAllowedOrigins = strings.Split(origins, ",")
		for i := range cfg.CORSAllowedOrigins {
			cfg.CORSAllowedOrigins[i] = strings.TrimSpace(cfg.CORSAllowedOrigins[i])
		}
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}
	return n
}

func getEnvFloat(key string, fallback float64) float64 {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	n, err := strconv.ParseFloat(v, 64)
	if err != nil {
		return fallback
	}
	return n
}
